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
import { TupleType } from "../Type/TupleType.js";
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
        const constraintType = this.childNodeParser.createType(node.typeParameter.constraint!, context);
        const keyListType = derefType(constraintType);
        const id = `indexed-type-${getKey(node, context)}`;
        const isKeyOf = this.isKeyOfConstraint(node);

        if (keyListType instanceof UnionType) {
            // When the constraint is `keyof T` where T is a tuple, the keys are sequential
            // numeric literals (0, 1, 2, ...). Preserve the tuple structure.
            if (isKeyOf) {
                const tupleIndices = this.getNumericLiteralIndices(keyListType);
                if (tupleIndices) {
                    const items = tupleIndices.map((idx) =>
                        this.childNodeParser.createType(node.type!, this.createSubContext(node, idx, context)),
                    );
                    return new TupleType(items);
                }
            }

            // Key type resolves to a set of known properties
            return new ObjectType(
                id,
                [],
                this.getProperties(node, keyListType, context),
                this.getAdditionalProperties(node, keyListType, context),
            );
        }

        if (keyListType instanceof LiteralType) {
            // Key type resolves to single known property
            return new ObjectType(id, [], this.getProperties(node, new UnionType([keyListType]), context), false);
        }

        const maybeUnionType = this.childNodeParser.createType(
            node.type!,
            this.createSubContext(node, keyListType, context),
        );
        if (constraintType?.getId() === "number" && !(maybeUnionType instanceof NeverType)) {
            // When keyof resolves to number (array) or the value is a union, produce an array.
            if (maybeUnionType instanceof UnionType || isKeyOf) {
                return new ArrayType(maybeUnionType);
            }
        }

        if (
            keyListType instanceof StringType ||
            keyListType instanceof NumberType ||
            keyListType instanceof SymbolType ||
            keyListType instanceof AnyType
        ) {
            // Key type widens to `string`
            const type = this.childNodeParser.createType(node.type!, this.createSubContext(node, keyListType, context));
            const resultType = new ObjectType(id, [], [], type);
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

    protected isKeyOfConstraint(node: ts.MappedTypeNode): boolean {
        const c = node.typeParameter.constraint;
        return (
            c?.kind === ts.SyntaxKind.TypeOperator &&
            (c as ts.TypeOperatorNode).operator === ts.SyntaxKind.KeyOfKeyword
        );
    }

    /** Returns sorted numeric literal indices if all keys are numeric (tuple keys), else undefined. */
    protected getNumericLiteralIndices(keyListType: UnionType): LiteralType[] | undefined {
        const types = keyListType.getFlattenedTypes(derefType);
        if (types.length === 0) return undefined;
        const indices: LiteralType[] = [];
        for (const t of types) {
            if (!(t instanceof LiteralType) || typeof t.getValue() !== "number") return undefined;
            indices.push(t);
        }
        return indices.sort((a, b) => (a.getValue() as number) - (b.getValue() as number));
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
}
