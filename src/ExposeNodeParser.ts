import * as ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { DefinitionType } from "./Type/DefinitionType";

export class ExposeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private subNodeParser: SubNodeParser,
        private expose: "all" | "none" | "export",
    ) {
    }

    public supportsNode(node: ts.Node): boolean {
        return this.subNodeParser.supportsNode(node);
    }
    public createType(node: ts.Node, context: Context): BaseType {
        const baseType: BaseType = this.subNodeParser.createType(node, context);
        if (!this.isExportNode(node)) {
            return baseType;
        }

        return new DefinitionType(
            this.getDefinitionName(node, context),
            baseType,
        );
    }

    private isExportNode(node: ts.Node): boolean {
        if (this.expose === "all") {
            return true;
        } else if (this.expose === "none") {
            return false;
        }

        const localSymbol: ts.Symbol = (node as any).localSymbol;
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }
    private getDefinitionName(node: ts.Node, context: Context): string {
        const fullName = this.typeChecker.getFullyQualifiedName((node as any).symbol).replace(/^".*"\./, "");
        const argumentIds = context.getArguments().map((arg: BaseType) => arg.getId());

        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
