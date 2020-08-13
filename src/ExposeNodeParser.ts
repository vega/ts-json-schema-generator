import * as path from "path";
import * as fs from "fs";
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
        private expose: "all" | "none" | "export"
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
        // search real export in sourceFile instead of the exportSymbol
        const sourceFile = node.getSourceFile();
        const moduleSymbol = this.typeChecker.getSymbolAtLocation(sourceFile);
        if (moduleSymbol) {
            const exportSymbols = this.typeChecker.getExportsOfModule(moduleSymbol);

            return exportSymbols.some((exportSymbol) => {
                const resolved = this.resolveAliasedSymbol(exportSymbol);
                return resolved.declarations?.some((declaration) => {
                    return declaration === node;
                });
            });
        }

        return false;
    }

    private getDefinitionName(node: ts.Node, context: Context): string {
        const symbol = symbolAtNode(node)!;
        let fullName = this.typeChecker.getFullyQualifiedName(symbol);

        // extract file path from fullName
        const fileIdentifier = fullName.replace(/^("(.*)"\.)?.*$/, "$2");

        // generate a lightweight file identifier
        if (fileIdentifier.length > 0) {
            // search module path
            const sourceFile = node.getSourceFile();
            const modulePath = this.searchModuleRoot(path.dirname(path.resolve(sourceFile.fileName)));
            const relativePath = modulePath ? path.relative(path.dirname(modulePath), fileIdentifier) : fileIdentifier;

            // replace slashes with . to avoid encoding path pollution
            // replace " with ' to separate file identifier from symbol name to avoid encoding
            const lightFileIdentifier = relativePath.replace(/(\/|\\)/g, ".");
            fullName = fullName.replace(`"${fileIdentifier}"`, `'${lightFileIdentifier}'`);
        }

        const argumentIds = context.getArguments().map((arg) => arg?.getName());

        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }

    private resolveAliasedSymbol(symbol: ts.Symbol): ts.Symbol {
        return symbol && ts.SymbolFlags.Alias & symbol.flags ? this.typeChecker.getAliasedSymbol(symbol) : symbol;
    }

    private searchModuleRoot(startFolderPath: string | string[]): string | undefined {
        let pathArray: string[];
        if (typeof startFolderPath === "string") {
            pathArray = startFolderPath.split(path.sep);
        } else {
            pathArray = startFolderPath;
        }

        if (!pathArray.length) {
            return undefined;
        }
        const dir = pathArray.join(path.sep);
        try {
            if (fs.existsSync(path.join(dir, "package.json"))) {
                return dir;
            }
        } catch (e) {
            // catch error
        }

        pathArray.pop();
        return this.searchModuleRoot(pathArray);
    }
}
