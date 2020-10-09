import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { OptionalType } from "../Type/OptionalType";

export class OptionalTypeNodeParser implements SubNodeParser {
    public constructor(private childNodeParser: NodeParser) {}
    public supportsNode(node: ts.OptionalTypeNode): boolean {
        return node.kind === ts.SyntaxKind.OptionalType;
    }
    public createType(node: ts.OptionalTypeNode, context: Context): BaseType | undefined {
        const type = this.childNodeParser.createType(node.type, context);
        if (!type) {
            return undefined;
        }
        return new OptionalType(type);
    }
}
