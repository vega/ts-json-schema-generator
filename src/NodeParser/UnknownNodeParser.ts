import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { UnknownNodeType } from "../Type/UnknownNodeType";
import { symbolAtNode } from "../Utils/symbolAtNode";

export class UnknownNodeParser implements SubNodeParser {
    public supportsNode(node: ts.Node): boolean {
        const symbol = symbolAtNode(node);
        return symbol ? true : false;
    }
    public createType(node: ts.Node, context: Context): BaseType {
        const symbol = symbolAtNode(node)!;
        return new UnknownNodeType(symbol.name);
    }
}
