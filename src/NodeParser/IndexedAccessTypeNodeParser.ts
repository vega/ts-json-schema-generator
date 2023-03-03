import ts from "typescript";
import { LogicError } from "../Error/LogicError";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";
import { NeverType } from "../Type/NeverType";
import { NumberType } from "../Type/NumberType";
import { ReferenceType } from "../Type/ReferenceType";
import { StringType } from "../Type/StringType";
import { TupleType } from "../Type/TupleType";
import { UnionType } from "../Type/UnionType";
import { derefType } from "../Utils/derefType";
import { getTypeByKey } from "../Utils/typeKeys";

export class IndexedAccessTypeNodeParser implements SubNodeParser {
    public constructor(protected typeChecker: ts.TypeChecker, protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.TypeNode): boolean {
        return node.kind === ts.SyntaxKind.IndexedAccessType;
    }

    private createIndexedType(objectType: ts.TypeNode, context: Context, indexType: BaseType): BaseType | undefined {
        if (ts.isTypeReferenceNode(objectType) && indexType instanceof LiteralType) {
            const declaration = this.typeChecker.getSymbolAtLocation(objectType.typeName)?.declarations?.[0];

            if (!declaration || !ts.isTypeAliasDeclaration(declaration) || !ts.isTypeLiteralNode(declaration.type)) {
                return undefined;
            }

            const member = declaration.type.members.find(
                (m): m is ts.PropertySignature & { type: ts.TypeNode } =>
                    ts.isPropertySignature(m) &&
                    Boolean(m.type) &&
                    ts.isIdentifier(m.name) &&
                    m.name.text === indexType.getValue()
            );

            return member && this.childNodeParser.createType(member.type, context);
        }

        return undefined;
    }

    public createType(node: ts.IndexedAccessTypeNode, context: Context): BaseType {
        const indexType = derefType(this.childNodeParser.createType(node.indexType, context));
        const indexedType = this.createIndexedType(node.objectType, context, indexType);

        if (indexedType) {
            return indexedType;
        }

        const objectType = derefType(this.childNodeParser.createType(node.objectType, context));
        if (objectType instanceof NeverType || indexType instanceof NeverType) {
            return new NeverType();
        }

        const indexTypes = indexType instanceof UnionType ? indexType.getTypes() : [indexType];
        const propertyTypes = indexTypes.map((type) => {
            if (!(type instanceof LiteralType || type instanceof StringType || type instanceof NumberType)) {
                throw new LogicError(
                    `Unexpected type "${type.getId()}" (expected "LiteralType" or "StringType" or "NumberType")`
                );
            }

            const propertyType = getTypeByKey(objectType, type);
            if (!propertyType) {
                if (type instanceof NumberType && objectType instanceof TupleType) {
                    return new UnionType(objectType.getTypes());
                } else if (type instanceof LiteralType) {
                    if (objectType instanceof ReferenceType) {
                        return objectType;
                    }
                    throw new LogicError(`Invalid index "${type.getValue()}" in type "${objectType.getId()}"`);
                } else {
                    throw new LogicError(`No additional properties in type "${objectType.getId()}"`);
                }
            }

            return propertyType;
        });
        return propertyTypes.length === 1 ? propertyTypes[0] : new UnionType(propertyTypes);
    }
}
