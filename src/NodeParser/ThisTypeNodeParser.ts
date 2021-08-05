import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";

export class ThisTypeNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker, private childNodeParser: SubNodeParser) {}

    public supportsNode(node: ts.ThisTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ThisType;
    }

    public createType(node: ts.ThisTypeNode, context: Context): BaseType | undefined {
        const moduleSymbol = this.typeChecker.getSymbolAtLocation(node);
        if (moduleSymbol) {
            return this.childNodeParser.createType(moduleSymbol.declarations![0], context);
        }

        return undefined;
    }
}
