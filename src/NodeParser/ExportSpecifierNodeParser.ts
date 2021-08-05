import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";

export class ExportSpecifierNodeParser implements SubNodeParser {
    public constructor(private typeChecker: ts.TypeChecker, private childNodeParser: NodeParser) { }

    public supportsNode(node: ts.ExportSpecifier): boolean {
        return node.kind === ts.SyntaxKind.ExportSpecifier;
    }

    public createType(node: ts.ExportSpecifier, context: Context): BaseType | undefined {
        const exportSymbol = this.typeChecker.getExportSpecifierLocalTargetSymbol(node);
        if (exportSymbol) {
            if (exportSymbol && exportSymbol.declarations?.length) {
                return this.childNodeParser.createType(exportSymbol.declarations[0], context);
            }
        }

        return undefined;
    }
}
