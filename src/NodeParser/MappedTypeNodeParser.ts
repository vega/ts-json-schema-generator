import ts from "typescript";
import { LogicError } from "../Error/LogicError";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { AnnotatedType } from "../Type/AnnotatedType";
import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";
import { DefinitionType } from "../Type/DefinitionType";
import { EnumType, EnumValue } from "../Type/EnumType";
import { LiteralType } from "../Type/LiteralType";
import { NeverType } from "../Type/NeverType";
import { NumberType } from "../Type/NumberType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { StringType } from "../Type/StringType";
import { SymbolType } from "../Type/SymbolType";
import { UnionType } from "../Type/UnionType";
import { derefAnnotatedType, derefType } from "../Utils/derefType";
import { getKey } from "../Utils/nodeKey";
import { preserveAnnotation } from "../Utils/preserveAnnotation";
import { removeUndefined } from "../Utils/removeUndefined";

export class MappedTypeNodeParser implements SubNodeParser {
    public constructor(
        protected childNodeParser: NodeParser,
        protected readonly additionalProperties: boolean
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
                this.getAdditionalProperties(node, keyListType, context)
            );
        } else if (keyListType instanceof LiteralType) {
            // Key type resolves to single known property
            return new ObjectType(id, [], this.getProperties(node, new UnionType([keyListType]), context), false);
        } else if (
            keyListType instanceof StringType ||
            keyListType instanceof NumberType ||
            keyListType instanceof SymbolType
        ) {
            if (constraintType?.getId() === "number") {
                const type = this.childNodeParser.createType(
                    node.type!,
                    this.createSubContext(node, keyListType, context)
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
        } else if (keyListType instanceof EnumType) {
            return new ObjectType(id, [], this.getValues(node, keyListType, context), false);
        } else if (keyListType instanceof NeverType) {
            return new ObjectType(id, [], [], false);
        } else {
            throw new LogicError(
                `Unexpected key type "${
                    constraintType ? constraintType.getId() : constraintType
                }" for type "${node.getText()}" (expected "UnionType" or "StringType")`
            );
        }
    }

    protected mapKey(node: ts.MappedTypeNode, rawKey: LiteralType, context: Context): BaseType {
        if (!node.nameType) {
            return rawKey;
        }
        const key = derefType(
            this.childNodeParser.createType(node.nameType, this.createSubContext(node, rawKey, context))
        );

        return key;
    }

    protected getProperties(node: ts.MappedTypeNode, keyListType: UnionType, context: Context): ObjectProperty[] {
        return keyListType
            .getTypes()
            .filter((type): type is LiteralType => type instanceof LiteralType)
            .map((type) => [type, this.mapKey(node, type, context)])
            .filter((value): value is [LiteralType, LiteralType] => value[1] instanceof LiteralType)
            .reduce((result: ObjectProperty[], [key, mappedKey]: [LiteralType, LiteralType]) => {
                const propertyType = this.childNodeParser.createType(
                    node.type!,
                    this.createSubContext(node, key, context)
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
                    !node.questionToken && !hasUndefined
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
                    this.createSubContext(node, new LiteralType(value!), context)
                );

                return new ObjectProperty(value!.toString(), type, !node.questionToken);
            });
    }

    protected getAdditionalProperties(
        node: ts.MappedTypeNode,
        keyListType: UnionType,
        context: Context
    ): BaseType | boolean {
        const key = keyListType.getTypes().filter((type) => !(type instanceof LiteralType))[0];
        if (key) {
            return (
                this.childNodeParser.createType(node.type!, this.createSubContext(node, key, context)) ??
                this.additionalProperties
            );
        } else {
            return this.additionalProperties;
        }
    }

    protected createSubContext(
        node: ts.MappedTypeNode,
        key: LiteralType | StringType,
        parentContext: Context
    ): Context {
        const subContext = new Context(node);

        parentContext.getParameters().forEach((parentParameter) => {
            subContext.pushParameter(parentParameter);
            subContext.pushArgument(parentContext.getArgument(parentParameter));
        });

        subContext.pushParameter(node.typeParameter.name.text);
        subContext.pushArgument(key);

        return subContext;
    }
}
