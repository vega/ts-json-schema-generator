import ts from "typescript";
import type { Config } from "./Config.js";
import { MultipleDefinitionsError, RootlessError } from "./Error/Errors.js";
import { Context, type NodeParser } from "./NodeParser.js";
import type { Definition } from "./Schema/Definition.js";
import type { Schema } from "./Schema/Schema.js";
import type { BaseType } from "./Type/BaseType.js";
import { DefinitionType } from "./Type/DefinitionType.js";
import type { TypeFormatter } from "./TypeFormatter.js";
import type { StringMap } from "./Utils/StringMap.js";
import { hasJsDocTag } from "./Utils/hasJsDocTag.js";
import { removeUnreachable } from "./Utils/removeUnreachable.js";
import { symbolAtNode } from "./Utils/symbolAtNode.js";

export class SchemaGenerator {
    public constructor(
        protected readonly program: ts.Program,
        protected readonly nodeParser: NodeParser,
        protected readonly typeFormatter: TypeFormatter,
        protected readonly config?: Config,
    ) {}

    public createSchema(fullName?: string): Schema {
        const rootNodes = this.getRootNodes(fullName);
        return this.createSchemaFromNodes(rootNodes);
    }

    public createSchemaFromNodes(rootNodes: ts.Node[]): Schema {
        const rootTypes = rootNodes.map((rootNode) => {
            return this.nodeParser.createType(rootNode, new Context());
        });

        const rootTypeDefinition = rootTypes.length === 1 ? this.getRootTypeDefinition(rootTypes[0]) : undefined;
        const definitions: StringMap<Definition> = {};

        for (const rootType of rootTypes) {
            this.appendRootChildDefinitions(rootType, definitions);
        }

        const reachableDefinitions = removeUnreachable(rootTypeDefinition, definitions);

        return {
            ...(this.config?.schemaId ? { $id: this.config.schemaId } : {}),
            $schema: "http://json-schema.org/draft-07/schema#",
            ...(rootTypeDefinition ?? {}),
            definitions: reachableDefinitions,
        };
    }

    protected getRootNodes(fullName: string | undefined): ts.Node[] {
        if (fullName && fullName !== "*") {
            return [this.findNamedNode(fullName)];
        }

        const rootFileNames = this.program.getRootFileNames();
        const rootSourceFiles = this.program
            .getSourceFiles()
            .filter((sourceFile) => rootFileNames.includes(sourceFile.fileName));
        const rootNodes = new Map<string, ts.Node>();
        this.appendTypes(rootSourceFiles, this.program.getTypeChecker(), rootNodes);
        return [...rootNodes.values()];
    }
    protected findNamedNode(fullName: string): ts.Node {
        const typeChecker = this.program.getTypeChecker();
        const allTypes = new Map<string, ts.Node>();
        const { projectFiles, externalFiles } = this.partitionFiles();

        this.appendTypes(projectFiles, typeChecker, allTypes);

        if (allTypes.has(fullName)) {
            return allTypes.get(fullName)!;
        }

        this.appendTypes(externalFiles, typeChecker, allTypes);

        if (allTypes.has(fullName)) {
            return allTypes.get(fullName)!;
        }

        throw new RootlessError(fullName);
    }
    protected getRootTypeDefinition(rootType: BaseType): Definition {
        return this.typeFormatter.getDefinition(rootType);
    }
    protected appendRootChildDefinitions(rootType: BaseType, childDefinitions: StringMap<Definition>): void {
        const seen = new Set<string>();

        const children = this.typeFormatter
            .getChildren(rootType)
            .filter((child): child is DefinitionType => child instanceof DefinitionType)
            .filter((child) => {
                if (!seen.has(child.getId())) {
                    seen.add(child.getId());
                    return true;
                }
                return false;
            });

        const ids = new Map<string, string>();
        for (const child of children) {
            const name = child.getName();
            const previousId = ids.get(name);
            // remove def prefix from ids to avoid false alarms
            // FIXME: we probably shouldn't be doing this as there is probably something wrong with the deduplication
            const childId = child.getId().replace(/def-/g, "");

            if (previousId && childId !== previousId) {
                throw new MultipleDefinitionsError(
                    name,
                    child,
                    children.find((c) => c.getId() === previousId),
                );
            }
            ids.set(name, childId);
        }

        children.reduce((definitions, child) => {
            const name = child.getName();
            if (!(name in definitions)) {
                definitions[name] = this.typeFormatter.getDefinition(child.getType());
            }
            return definitions;
        }, childDefinitions);
    }
    protected partitionFiles(): {
        projectFiles: ts.SourceFile[];
        externalFiles: ts.SourceFile[];
    } {
        const projectFiles = new Array<ts.SourceFile>();
        const externalFiles = new Array<ts.SourceFile>();

        for (const sourceFile of this.program.getSourceFiles()) {
            const destination = sourceFile.fileName.includes("/node_modules/") ? externalFiles : projectFiles;
            destination.push(sourceFile);
        }

        return { projectFiles, externalFiles };
    }

    protected appendTypes(
        sourceFiles: readonly ts.SourceFile[],
        typeChecker: ts.TypeChecker,
        types: Map<string, ts.Node>,
    ): void {
        for (const sourceFile of sourceFiles) {
            this.inspectNode(sourceFile, typeChecker, types);
        }
    }

    protected inspectNode(node: ts.Node, typeChecker: ts.TypeChecker, allTypes: Map<string, ts.Node>): void {
        if (ts.isVariableDeclaration(node)) {
            if (
                node.initializer?.kind === ts.SyntaxKind.ArrowFunction ||
                node.initializer?.kind === ts.SyntaxKind.FunctionExpression
            ) {
                this.inspectNode(node.initializer, typeChecker, allTypes);
            }

            return;
        }

        if (
            ts.isInterfaceDeclaration(node) ||
            ts.isClassDeclaration(node) ||
            ts.isEnumDeclaration(node) ||
            ts.isTypeAliasDeclaration(node)
        ) {
            if (
                (this.config?.expose === "all" || this.isExportType(node)) &&
                !this.isGenericType(node as ts.TypeAliasDeclaration)
            ) {
                allTypes.set(this.getFullName(node, typeChecker), node);
                return;
            }
            return;
        }

        if (
            ts.isFunctionDeclaration(node) ||
            ts.isFunctionExpression(node) ||
            ts.isArrowFunction(node) ||
            ts.isConstructorTypeNode(node)
        ) {
            allTypes.set(this.getFullName(node, typeChecker), node);
            return;
        }

        if (ts.isExportSpecifier(node)) {
            const symbol = typeChecker.getExportSpecifierLocalTargetSymbol(node);

            if (symbol?.declarations?.length === 1) {
                const declaration = symbol.declarations[0];

                if (ts.isImportSpecifier(declaration)) {
                    // Handling the `Foo` in `import { Foo } from "./lib"; export { Foo };`
                    const type = typeChecker.getTypeAtLocation(declaration);

                    if (type.symbol?.declarations?.length === 1) {
                        this.inspectNode(type.symbol.declarations[0], typeChecker, allTypes);
                    }
                } else {
                    // Handling the `Bar` in `export { Bar } from './lib';`
                    this.inspectNode(declaration, typeChecker, allTypes);
                }
            }

            return;
        }

        if (ts.isExportDeclaration(node)) {
            if (!ts.isExportDeclaration(node)) {
                return;
            }

            // export { variable } clauses
            if (!node.moduleSpecifier) {
                return;
            }

            const symbol = typeChecker.getSymbolAtLocation(node.moduleSpecifier);

            // should never hit this (maybe type error in user's code)
            if (!symbol || !symbol.declarations) {
                return;
            }

            // module augmentation can result in more than one source file
            for (const source of symbol.declarations) {
                const sourceSymbol = typeChecker.getSymbolAtLocation(source);

                if (!sourceSymbol) {
                    return;
                }

                const moduleExports = typeChecker.getExportsOfModule(sourceSymbol);

                for (const moduleExport of moduleExports) {
                    const nodes =
                        moduleExport.declarations ||
                        (!!moduleExport.valueDeclaration && [moduleExport.valueDeclaration]);

                    // should never hit this (maybe type error in user's code)
                    if (!nodes) {
                        return;
                    }

                    for (const subnodes of nodes) {
                        this.inspectNode(subnodes, typeChecker, allTypes);
                    }
                }
            }

            return;
        }

        ts.forEachChild(node, (subnode) => this.inspectNode(subnode, typeChecker, allTypes));
    }

    protected isExportType(
        node: ts.InterfaceDeclaration | ts.ClassDeclaration | ts.EnumDeclaration | ts.TypeAliasDeclaration,
    ): boolean {
        if (this.config?.jsDoc !== "none" && hasJsDocTag(node, "internal")) {
            return false;
        }

        //@ts-expect-error - internal typescript API
        return !!node.localSymbol?.exportSymbol;
    }

    protected isGenericType(node: ts.TypeAliasDeclaration): boolean {
        return !!(node.typeParameters && node.typeParameters.length > 0);
    }

    protected getFullName(node: ts.Declaration, typeChecker: ts.TypeChecker): string {
        return typeChecker.getFullyQualifiedName(symbolAtNode(node)!).replace(/".*"\./, "");
    }
}
