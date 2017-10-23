import * as ts from "typescript";

import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { FunctionType } from "../Type/FunctionType";

export class FunctionNodeParser implements SubNodeParser {
    public supportsNode(node: ts.FunctionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.FunctionType;
    }
    public createType(node: ts.FunctionExpression, context: Context): BaseType {
        return new FunctionType();
    }
}
