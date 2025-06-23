import ts from "typescript";
import type { Context } from "./NodeParser.js";
import type { SubNodeParser } from "./SubNodeParser.js";
import type { BaseType } from "./Type/BaseType.js";
import { DefinitionType } from "./Type/DefinitionType.js";
import type { ReferenceType } from "./Type/ReferenceType.js";
import { hasJsDocTag } from "./Utils/hasJsDocTag.js";
import { symbolAtNode } from "./Utils/symbolAtNode.js";
import { AliasType } from "./Type/AliasType.js";
import { derefAliasedType, isDeepLiteralUnion } from "./Utils/derefType.js";
import { ObjectType } from "./Type/ObjectType.js";
import { IntersectionType } from "./Type/IntersectionType.js";

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

    public createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType {
        const baseType = this.subNodeParser.createType(node, context, reference);

        if (!this.isExportNode(node) || this.isFromLib(node) || this.shouldInline(node, baseType, context)) {
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

    private isFromLib(node: ts.Node): boolean {
        const sourceFile = node.getSourceFile();
        if (!sourceFile) {
            return false;
        }
        return /[\\/]typescript[\\/]lib[\\/]/i.test(sourceFile.fileName);
    }

    private shouldInline(node: ts.Node, type: BaseType, context: Context): boolean {
        if (!ts.isTypeAliasDeclaration(node)) {
            return false;
        }
        if (!(type instanceof AliasType)) {
            return false;
        }
        if (!node.typeParameters?.length) {
            return false;
        }

        const localSymbol: ts.Symbol = (node as any).localSymbol;
        const isExported = localSymbol ? "exportSymbol" in localSymbol : false;
        if (isExported) {
            return false;
        }

        const actual = derefAliasedType(type.getType());
        if (isDeepLiteralUnion(actual)) {
            return true;
        }

        // Inline non-exported generics producing structural object types to avoid
        // unwieldy definition names like `Alias<structure-...>` when expose: all
        if (actual instanceof ObjectType || actual instanceof IntersectionType) {
            return true;
        }

        // Inline when any generic argument is structural (e.g. `structure-xyz`)
        if (context.getArguments().some((arg) => /^structure-/.test(arg?.getName()))) {
            return true;
        }

        return false;
    }
}
