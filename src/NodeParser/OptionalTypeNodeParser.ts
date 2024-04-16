import ts from "typescript";
import { Context, NodeParser } from "../NodeParser.js";
import { SubNodeParser } from "../SubNodeParser.js";
import { BaseType } from "../Type/BaseType.js";
import { OptionalType } from "../Type/OptionalType.js";

export class OptionalTypeNodeParser implements SubNodeParser {
    public constructor(protected childNodeParser: NodeParser) {}
    public supportsNode(node: ts.OptionalTypeNode): boolean {
        return node.kind === ts.SyntaxKind.OptionalType;
    }
    public createType(node: ts.OptionalTypeNode, context: Context): BaseType {
        const type = this.childNodeParser.createType(node.type, context);
        return new OptionalType(type);
    }
}
