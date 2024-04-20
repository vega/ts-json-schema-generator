import ts from "typescript";
import { Context, NodeParser } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { ArrayType } from "../Type/ArrayType.js";
import { BaseType } from "../Type/BaseType.js";
import { NumberType } from "../Type/NumberType.js";
import { ObjectType } from "../Type/ObjectType.js";
import { StringType } from "../Type/StringType.js";
import { UnionType } from "../Type/UnionType.js";
import { derefType } from "../Utils/derefType.js";
import { getTypeKeys } from "../Utils/typeKeys.js";

export class TypeOperatorNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}

    public supportsNode(node: ts.TypeOperatorNode): boolean {
        return node.kind === ts.SyntaxKind.TypeOperator;
    }

    public createType(node: ts.TypeOperatorNode, context: Context): BaseType {
        const type = this.childNodeParser.createType(node.type, context);
        const derefed = derefType(type);
        // Remove readonly modifier from type
        if (node.operator === ts.SyntaxKind.ReadonlyKeyword && derefed) {
            return derefed;
        }
        if (derefed instanceof ArrayType) {
            return new NumberType();
        }
        const keys = getTypeKeys(type);
        if (derefed instanceof ObjectType && derefed.getAdditionalProperties()) {
            return new UnionType([...keys, new StringType()]);
        }

        if (keys.length === 1) {
            return keys[0];
        }

        return new UnionType(keys);
    }
}
