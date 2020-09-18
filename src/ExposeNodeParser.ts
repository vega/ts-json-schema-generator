import * as ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { DefinitionType } from "./Type/DefinitionType";
import { ReferenceType } from "./Type/ReferenceType";
import { symbolAtNode } from "./Utils/symbolAtNode";

export class ExposeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private subNodeParser: SubNodeParser,
        private expose: "all" | "none" | "export",
        private jsDoc: "none" | "extended" | "basic"
    ) {}

    public supportsNode(node: ts.Node): boolean {
        return this.subNodeParser.supportsNode(node);
    }

    public createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType | undefined {
        const baseType = this.subNodeParser.createType(node, context, reference);

        if (baseType === undefined) {
            return undefined;
        }

        if (!this.isExportNode(node)) {
            return baseType;
        }

        return new DefinitionType(this.getDefinitionName(node, context), baseType);
    }

    private isExportNode(node: ts.Node): boolean {
        if (this.expose === "all") {
            return node.kind !== ts.SyntaxKind.TypeLiteral;
        } else if (this.expose === "none") {
            return false;
        } else if (this.jsDoc !== "none" && this.isPrivateNode(node)) {
            return false;
        }

        const localSymbol: ts.Symbol = (node as any).localSymbol;
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }

    private isPrivateNode(node: ts.Node): boolean {
        const jsDocTags = symbolAtNode(node)?.getJsDocTags();
        const privateTag = jsDocTags?.find((tag) => tag.name === "private");

        return !!privateTag;
    }

    private getDefinitionName(node: ts.Node, context: Context): string {
        const symbol = symbolAtNode(node)!;
        const fullName = this.typeChecker.getFullyQualifiedName(symbol).replace(/^".*"\./, "");
        const argumentIds = context.getArguments().map((arg) => arg?.getName());

        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
