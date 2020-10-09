import ts from "typescript";
import { LogicError } from "../Error/LogicError";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";
import { NumberType } from "../Type/NumberType";
import { StringType } from "../Type/StringType";
import { TupleType } from "../Type/TupleType";
import { UnionType } from "../Type/UnionType";
import { derefType } from "../Utils/derefType";
import { getTypeByKey } from "../Utils/typeKeys";

export class IndexedAccessTypeNodeParser implements SubNodeParser {
    public constructor(private childNodeParser: NodeParser) {}

    public supportsNode(node: ts.IndexedAccessTypeNode): boolean {
        return node.kind === ts.SyntaxKind.IndexedAccessType;
    }

    public createType(node: ts.IndexedAccessTypeNode, context: Context): BaseType | undefined {
        const objectType = derefType(this.childNodeParser.createType(node.objectType, context));
        const indexType = derefType(this.childNodeParser.createType(node.indexType, context));

        if (objectType === undefined || indexType === undefined) {
            return undefined;
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
