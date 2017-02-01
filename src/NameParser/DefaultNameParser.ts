import * as ts from "typescript";
import { Context } from "../NodeParser";
import { NameParser } from "../NameParser";
import { BaseType } from "../Type/BaseType";

export class DefaultNameParser implements NameParser {
    public constructor(
        private namePrefix: string,
        private typeChecker: ts.TypeChecker,
    ) {
    }

    public isExportNode(node: ts.Node): boolean {
        const localSymbol: ts.Symbol = (node as any).localSymbol;
        return localSymbol ? (localSymbol.flags & ts.SymbolFlags.ExportType) !== 0 : false;
    }
    public getDefinitionName(node: ts.Node, context: Context): string {
        const fullName: string = this.typeChecker.getFullyQualifiedName((node as any).symbol).replace(/^".*"\./, "");
        const argumentIds: string[] = context.getArguments().map((arg: BaseType) => arg.getId());

        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
    public getTypeId(node: ts.Node, context: Context): string {
        const fullName: string = this.namePrefix + node.getFullStart();
        const argumentIds: string[] = context.getArguments().map((arg: BaseType) => arg.getId());

        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
