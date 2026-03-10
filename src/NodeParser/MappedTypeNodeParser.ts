import ts from "typescript";
import { ExpectationFailedError } from "../Error/Errors.js";
import type { NodeParser } from "../NodeParser.js";
import { Context } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import { AnnotatedType } from "../Type/AnnotatedType.js";
import { AnyType } from "../Type/AnyType.js";
import { ArrayType } from "../Type/ArrayType.js";
import type { BaseType } from "../Type/BaseType.js";
import { DefinitionType } from "../Type/DefinitionType.js";
import type { EnumValue } from "../Type/EnumType.js";
import { EnumType } from "../Type/EnumType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { NeverType } from "../Type/NeverType.js";
import { NumberType } from "../Type/NumberType.js";
import { ObjectProperty, ObjectType } from "../Type/ObjectType.js";
import { StringType } from "../Type/StringType.js";
import { SymbolType } from "../Type/SymbolType.js";
import { UnionType } from "../Type/UnionType.js";
import { derefAnnotatedType, derefType, isDeepLiteralUnion } from "../Utils/derefType.js";
import { getKey } from "../Utils/nodeKey.js";
import { preserveAnnotation } from "../Utils/preserveAnnotation.js";
import { removeUndefined } from "../Utils/removeUndefined.js";
import { uniqueTypeArray } from "../Utils/uniqueTypeArray.js";

export class MappedTypeNodeParser implements SubNodeParser {
    public constructor(
        protected childNodeParser: NodeParser,
        protected readonly additionalProperties: boolean,
    ) {}

    public supportsNode(node: ts.MappedTypeNode): boolean {
        return node.kind === ts.SyntaxKind.MappedType;
    }

    public createType(node: ts.MappedTypeNode, context: Context): BaseType {
        // Check if the constraint is `keyof T` where T resolves to a union type.
        // In TypeScript, mapped types distribute over unions, so `{ [P in keyof (A | B)]: ... }`
        // is equivalent to `{ [P in keyof A]: ... } | { [P in keyof B]: ... }`.
        const distributedType = this.tryDistributeUnion(node, context);
        if (distributedType) {
            return distributedType;
        }

        const constraintType = this.childNodeParser.createType(node.typeParameter.constraint!, context);
        const keyListType = derefType(constraintType);

        const id = `indexed-type-${getKey(node, context)}`;

        const objectType = this.createObjectFromKeyList(node, keyListType, id, context);
        if (objectType) {
            return objectType;
        }

        const maybeUnionType = this.childNodeParser.createType(
            node.type!,
            this.createSubContext(node, keyListType, context),
        );
        if (maybeUnionType instanceof UnionType && constraintType?.getId() === "number") {
            // Then we turn it into an array
            return maybeUnionType instanceof NeverType ? new NeverType() : new ArrayType(maybeUnionType);
        }

        if (
            keyListType instanceof StringType ||
            keyListType instanceof NumberType ||
            keyListType instanceof SymbolType ||
            keyListType instanceof AnyType
        ) {
            // Key type widens to `string`
            const type = this.childNodeParser.createType(node.type!, this.createSubContext(node, keyListType, context));
            // const resultType = type instanceof NeverType ? new NeverType() : new ObjectType(id, [], [], type);
            const resultType = new ObjectType(id, [], [], type);
            if (resultType) {
                let annotations;

                if (constraintType instanceof AnnotatedType) {
                    annotations = constraintType.getAnnotations();
                } else if (constraintType instanceof DefinitionType) {
                    const childType = constraintType.getType();
                    if (childType instanceof AnnotatedType) {
                        annotations = childType.getAnnotations();
                    }
                }
                if (annotations) {
                    return new AnnotatedType(resultType, { propertyNames: annotations }, false);
                }
            }
            return resultType;
        }

        if (keyListType instanceof EnumType) {
            return new ObjectType(id, [], this.getValues(node, keyListType, context), false);
        }

        if (keyListType instanceof NeverType) {
            return new ObjectType(id, [], [], false);
        }

        throw new ExpectationFailedError(
            `Unexpected key type "${
                constraintType ? constraintType.getId() : constraintType
            }" for this node. (expected "UnionType" or "StringType")`,
            node,
        );
    }

    /**
     * In mapped types, questionToken can be:
     * - undefined: no optional modifier
     * - QuestionToken (?): add optional
     * - PlusToken (+?): add optional
     * - MinusToken (-?): remove optional (e.g. Required<T>) → property is required
     */
    protected isMappedPropertyRequired(node: ts.MappedTypeNode, hasUndefinedInType: boolean): boolean {
        if (node.questionToken === undefined) {
            return !hasUndefinedInType;
        }
        if (node.questionToken.kind === ts.SyntaxKind.MinusToken) {
            return true; // -? removes optional → output property is always required
        }
        return false;
    }

    // Attempts to create an ObjectType from a resolved key list type.
    // Handles UnionType (set of known property keys) and LiteralType (single known property key).
    // Returns undefined if the key list type is not one of these.
    protected createObjectFromKeyList(
        node: ts.MappedTypeNode,
        keyListType: BaseType,
        id: string,
        context: Context,
    ): ObjectType | undefined {
        if (keyListType instanceof UnionType) {
            return new ObjectType(
                id,
                [],
                this.getProperties(node, keyListType, context),
                this.getAdditionalProperties(node, keyListType, context),
            );
        }

        if (keyListType instanceof LiteralType) {
            return new ObjectType(id, [], this.getProperties(node, new UnionType([keyListType]), context), false);
        }

        return undefined;
    }

    protected mapKey(node: ts.MappedTypeNode, rawKey: LiteralType, context: Context): BaseType {
        if (!node.nameType) {
            return rawKey;
        }
        return derefType(this.childNodeParser.createType(node.nameType, this.createSubContext(node, rawKey, context)));
    }

    protected getProperties(node: ts.MappedTypeNode, keyListType: UnionType, context: Context): ObjectProperty[] {
        return uniqueTypeArray(keyListType.getFlattenedTypes(derefType))
            .filter((type): type is LiteralType => type instanceof LiteralType)
            .map((type) => [type, this.mapKey(node, type, context)])
            .filter((value): value is [LiteralType, LiteralType] => value[1] instanceof LiteralType)
            .reduce((result: ObjectProperty[], [key, mappedKey]: [LiteralType, LiteralType]) => {
                const propertyType = this.childNodeParser.createType(
                    node.type!,
                    this.createSubContext(node, key, context),
                );

                let newType = derefAnnotatedType(propertyType);
                let hasUndefined = false;
                if (newType instanceof UnionType) {
                    const { newType: newType_, numRemoved } = removeUndefined(newType);
                    hasUndefined = numRemoved > 0;
                    newType = newType_;
                }

                const objectProperty = new ObjectProperty(
                    mappedKey.getValue().toString(),
                    preserveAnnotation(propertyType, newType),
                    this.isMappedPropertyRequired(node, hasUndefined),
                );

                result.push(objectProperty);
                return result;
            }, []);
    }

    protected getValues(node: ts.MappedTypeNode, keyListType: EnumType, context: Context): ObjectProperty[] {
        return keyListType
            .getValues()
            .filter((value: EnumValue) => value != null)
            .map((value: EnumValue) => {
                const type = this.childNodeParser.createType(
                    node.type!,
                    this.createSubContext(node, new LiteralType(value!), context),
                );

                return new ObjectProperty(value!.toString(), type, this.isMappedPropertyRequired(node, false));
            });
    }

    protected getAdditionalProperties(
        node: ts.MappedTypeNode,
        keyListType: UnionType,
        context: Context,
    ): BaseType | boolean {
        if (isDeepLiteralUnion(keyListType)) {
            return this.additionalProperties;
        }

        const key = keyListType.getTypes().filter((type) => !(derefType(type) instanceof LiteralType))[0];

        if (key) {
            return (
                this.childNodeParser.createType(node.type!, this.createSubContext(node, key, context)) ??
                this.additionalProperties
            );
        }

        return this.additionalProperties;
    }

    protected createSubContext(
        node: ts.MappedTypeNode,
        key: LiteralType | StringType | NumberType,
        parentContext: Context,
    ): Context {
        const subContext = new Context(node);

        for (const parentParameter of parentContext.getParameters()) {
            subContext.pushParameter(parentParameter);
            subContext.pushArgument(parentContext.getArgument(parentParameter));
        }

        subContext.pushParameter(node.typeParameter.name.text);
        subContext.pushArgument(key);

        return subContext;
    }

    // Checks if the mapped type's constraint is `keyof T` where `T` is a type parameter
    // that resolves to a union type in the current context.
    // If so, distributes the mapped type over each union member (like TypeScript does),
    // returning a UnionType of the individually mapped types.
    //
    // TypeScript distributes mapped types over union type parameters:
    // `{ [P in keyof T]: X }` where `T = A | B` becomes `{ [P in keyof A]: X } | { [P in keyof B]: X }`
    protected tryDistributeUnion(node: ts.MappedTypeNode, context: Context): BaseType | undefined {
        const { constraint } = node.typeParameter;
        if (!constraint) {
            return undefined;
        }

        // Check if constraint is `keyof X`
        if (!ts.isTypeOperatorNode(constraint) || constraint.operator !== ts.SyntaxKind.KeyOfKeyword) {
            return undefined;
        }

        // Resolve the operand type (X in `keyof X`)
        const operandType = this.childNodeParser.createType(constraint.type, context);
        const derefedOperand = derefType(operandType);

        if (!(derefedOperand instanceof UnionType)) {
            return undefined;
        }

        const unionMembers = derefedOperand.getTypes();

        // Only distribute if the union contains object-like types (not a union of literals/primitives)
        const hasObjectTypes = unionMembers.some((member) => {
            const derefed = derefType(member);
            return derefed instanceof ObjectType;
        });

        if (!hasObjectTypes) {
            return undefined;
        }

        // Distribute the mapping for each union type individually
        const mappedTypes = unionMembers.map((member) => {
            // Create a new context where the operand type parameter is bound to this union member
            const subContext = new Context(node);

            for (const parentParameter of context.getParameters()) {
                const arg = context.getArgument(parentParameter);
                // If this argument is the union we're distributing over, replace it with the member
                if (arg === operandType || derefType(arg) === derefedOperand) {
                    subContext.pushParameter(parentParameter);
                    subContext.pushArgument(member);
                } else {
                    subContext.pushParameter(parentParameter);
                    subContext.pushArgument(arg);
                }
            }

            // Now resolve the constraint (keyof member) and create the mapped type for this member
            const memberConstraintType = this.childNodeParser.createType(constraint, subContext);
            const memberKeyListType = derefType(memberConstraintType);
            const memberId = `indexed-type-${getKey(node, subContext)}`;

            return this.createObjectFromKeyList(node, memberKeyListType, memberId, subContext)
                ?? this.createType(node, subContext);
        });

        const result = new UnionType(mappedTypes).normalize();

        // Preserve annotations (e.g., @discriminator) from the original operand type
        // onto the resulting union, since the distribution creates a brand new UnionType.
        return preserveAnnotation(operandType, result);
    }
}
