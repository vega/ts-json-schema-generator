import ts from "typescript";
import { Context } from "./NodeParser.js";
import { SubNodeParser } from "./SubNodeParser.js";
import { BaseType } from "./Type/BaseType.js";
import { DefinitionType } from "./Type/DefinitionType.js";
import { ReferenceType } from "./Type/ReferenceType.js";
import { hasJsDocTag } from "./Utils/hasJsDocTag.js";
import { symbolAtNode } from "./Utils/symbolAtNode.js";

export class ExposeNodeParser implements SubNodeParser {
    public constructor(
        protected typeChecker: ts.TypeChecker,
        protected subNodeParser: SubNodeParser,
        protected expose: "all" | "none" | "export",
        protected jsDoc: "none" | "extended" | "basic",
    ) {}

    public supportsNode(node: ts.Node): boolean {
        return this.subNodeParser.supportsNode(node);
    }

    public createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType | undefined {
        const baseType = this.subNodeParser.createType(node, context, reference);
        if (!baseType) return undefined;

        if (!this.isExportNode(node)) {
            return baseType;
        }

        return new DefinitionType(this.getDefinitionName(node, context), baseType);
    }

    protected isExportNode(node: ts.Node): boolean {
        if (this.expose === "all") {
            return node.kind !== ts.SyntaxKind.TypeLiteral;
        } else if (this.expose === "none") {
            return false;
        } else if (this.jsDoc !== "none" && hasJsDocTag(node, "internal")) {
            return false;
        }

        const localSymbol: ts.Symbol = (node as any).localSymbol;
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }

    protected getDefinitionName(node: ts.Node, context: Context): string {
        const symbol = symbolAtNode(node)!;
        const fullName = this.typeChecker.getFullyQualifiedName(symbol).replace(/^".*"\./, "");
        const argumentIds = context.getArguments().map((arg) => arg?.getName());

        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
