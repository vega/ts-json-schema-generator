import ts from "typescript";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import { UnknownType } from "../Type/UnknownType.js";

export class UnknownTypeNodeParser implements SubNodeParser {
    public supportsNode(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.UnknownKeyword;
    }

    public createType(): BaseType {
        return new UnknownType(false);
    }
}
