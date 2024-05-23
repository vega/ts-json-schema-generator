import ts from "typescript";
import { ExpectationFailedTJSGError } from "../Error/Errors.js";
import { Context, NodeParser } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { AnnotatedType } from "../Type/AnnotatedType.js";
import { ArrayType } from "../Type/ArrayType.js";
import { BaseType } from "../Type/BaseType.js";
import { DefinitionType } from "../Type/DefinitionType.js";
import { EnumType, EnumValue } from "../Type/EnumType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { NeverType } from "../Type/NeverType.js";
import { NumberType } from "../Type/NumberType.js";
import { ObjectProperty, ObjectType } from "../Type/ObjectType.js";
import { StringType } from "../Type/StringType.js";
import { SymbolType } from "../Type/SymbolType.js";
import { UnionType } from "../Type/UnionType.js";
import { derefAnnotatedType, derefType } from "../Utils/derefType.js";
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

        if (keyListType instanceof UnionType) {
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

        if (
            keyListType instanceof StringType ||
            keyListType instanceof NumberType ||
            keyListType instanceof SymbolType
        ) {
            if (constraintType?.getId() === "number") {
                const type = this.childNodeParser.createType(
                    node.type!,
                    this.createSubContext(node, keyListType, context),
                );
                return type instanceof NeverType ? new NeverType() : new ArrayType(type);
            }
            // Key type widens to `string`
            const type = this.childNodeParser.createType(node.type!, context);
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

        throw new ExpectationFailedTJSGError(
            `Unexpected key type "${
                constraintType ? constraintType.getId() : constraintType
            }" for this node. (expected "UnionType" or "StringType")`,
            node,
        );
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
                    !node.questionToken && !hasUndefined,
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

                return new ObjectProperty(value!.toString(), type, !node.questionToken);
            });
    }

    protected getAdditionalProperties(
        node: ts.MappedTypeNode,
        keyListType: UnionType,
        context: Context,
    ): BaseType | boolean {
        const key = keyListType.getTypes().filter((type) => !(type instanceof LiteralType))[0];

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
}
