import ts from "typescript";
import { NoRootTypeError } from "./Error/NoRootTypeError";
import { Context, NodeParser } from "./NodeParser";
import { Definition } from "./Schema/Definition";
import { Schema } from "./Schema/Schema";
import { BaseType } from "./Type/BaseType";
import { DefinitionType } from "./Type/DefinitionType";
import { TypeFormatter } from "./TypeFormatter";
import { StringMap } from "./Utils/StringMap";
import { localSymbolAtNode, symbolAtNode } from "./Utils/symbolAtNode";
import { removeUnreachable } from "./Utils/removeUnreachable";
import { Config } from "./Config";
import { hasJsDocTag } from "./Utils/hasJsDocTag";

export interface TypeMap {
    fileName: string;
    typeNames: string[];
    exports?: string[];
}

export class SchemaGenerator {
    public constructor(
        protected readonly program: ts.Program,
        protected readonly nodeParser: NodeParser,
        protected readonly typeFormatter: TypeFormatter,
        protected readonly config?: Config
    ) { }

    public createSchema(fullName?: string, typeMapResult?: TypeMap[]): Schema {
        const rootNodes = this.getRootNodes(fullName);
        return this.createSchemaFromNodes(rootNodes, typeMapResult);
    }

    public createSchemaFromNodes(rootNodes: ts.Node[], typeMapResult?: TypeMap[]): Schema {
        const rootTypes = rootNodes.map((rootNode) => {
            return this.nodeParser.createType(rootNode, new Context());
        });

        const rootTypeDefinition = rootTypes.length === 1 ? this.getRootTypeDefinition(rootTypes[0]) : undefined;
        const definitions: StringMap<Definition> = {};
        const rootTypeNames = rootTypes.map((rootType) => this.appendRootChildDefinitions(rootType, definitions));

        const reachableDefinitions = removeUnreachable(rootTypeDefinition, definitions);

        typeMapResult?.splice(0, Infinity, ...this.createTypeMaps(rootNodes, rootTypeNames, reachableDefinitions));

        return {
            ...(this.config?.schemaId ? { $id: this.config.schemaId } : {}),
            $schema: "http://json-schema.org/draft-07/schema#",
            ...(rootTypeDefinition ?? {}),
            definitions: reachableDefinitions,
        };
    }

    protected createTypeMaps(
        rootNodes: ts.Node[],
        rootTypeNames: string[][],
        reachableDefinitions: StringMap<Definition>
    ): TypeMap[] {
        const typeMaps: Record<string, TypeMap> = {};
        const typeSeen = new Set<string>();
        const nameSeen = new Set<string>();

        rootNodes.forEach((rootNode, i) => {
            const sourceFile = rootNode.getSourceFile();
            const fileName = sourceFile.fileName;
            const typeMap = (typeMaps[fileName] ??= {
                fileName,
                typeNames: [],
                exports: ts.isExternalModule(sourceFile) ? [] : undefined,
            });

            const typeNames = rootTypeNames[i].filter(
                (typeName) => !!reachableDefinitions[typeName] && !typeName.startsWith("NamedParameters<typeof ")
            );

            const exports = typeNames
                .map((typeName) => typeName.replace(/[<.].*/g, ""))
                .filter((type) => symbolAtNode(sourceFile)?.exports?.has(ts.escapeLeadingUnderscores(type)))
                .filter((type) => !typeSeen.has(type) && typeSeen.add(type));

            typeMap.typeNames.push(...typeNames.filter((name) => !nameSeen.has(name) && nameSeen.add(name)));
            typeMap.exports?.push(...exports);
        });

        return Object.values(typeMaps).filter((tm) => !tm.exports || tm.exports.length || tm.typeNames.length);
    }

    protected getRootNodes(fullName: string | undefined): ts.Node[] {
        if (fullName && fullName !== "*") {
            return [this.findNamedNode(fullName)];
        } else {
            const rootFileNames = this.program.getRootFileNames();
            const rootSourceFiles = this.program
                .getSourceFiles()
                .filter((sourceFile) => rootFileNames.includes(sourceFile.fileName));
            const rootNodes = new Map<string, ts.Node>();
            this.appendTypes(rootSourceFiles, this.program.getTypeChecker(), rootNodes);
            return [...rootNodes.values()];
        }
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

        throw new NoRootTypeError(fullName);
    }
    protected getRootTypeDefinition(rootType: BaseType): Definition {
        return this.typeFormatter.getDefinition(rootType);
    }
    protected appendRootChildDefinitions(rootType: BaseType, childDefinitions: StringMap<Definition>): string[] {
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
                throw new Error(`Type "${name}" has multiple definitions.`);
            }
            ids.set(name, childId);
        }

        const names: string[] = [];
        children.reduce((definitions, child) => {
            const name = child.getName();
            if (!(name in definitions)) {
                definitions[name] = this.typeFormatter.getDefinition(child.getType());
            }
            names.push(name);
            return definitions;
        }, childDefinitions);
        return names;
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
        types: Map<string, ts.Node>
    ): void {
        for (const sourceFile of sourceFiles) {
            this.inspectNode(sourceFile, typeChecker, types);
        }
    }
    protected inspectNode(node: ts.Node, typeChecker: ts.TypeChecker, allTypes: Map<string, ts.Node>): void {
        switch (node.kind) {
            case ts.SyntaxKind.VariableDeclaration: {
                const variableDeclarationNode = node as ts.VariableDeclaration;
                if (
                    variableDeclarationNode.initializer?.kind === ts.SyntaxKind.ArrowFunction ||
                    variableDeclarationNode.initializer?.kind === ts.SyntaxKind.FunctionExpression
                ) {
                    this.inspectNode(variableDeclarationNode.initializer, typeChecker, allTypes);
                }
                return;
            }
            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.EnumDeclaration:
            case ts.SyntaxKind.TypeAliasDeclaration:
                if (
                    this.config?.expose === "all" ||
                    (this.isExportType(node) && !this.isGenericType(node as ts.TypeAliasDeclaration))
                ) {
                    allTypes.set(this.getFullName(node, typeChecker), node);
                    return;
                }
                return;
            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.FunctionExpression:
            case ts.SyntaxKind.ArrowFunction:
                allTypes.set(`NamedParameters<typeof ${this.getFullName(node, typeChecker)}>`, node);
                return;
            default:
                ts.forEachChild(node, (subnode) => this.inspectNode(subnode, typeChecker, allTypes));
                return;
        }
    }
    protected isExportType(node: ts.Node): boolean {
        if (this.config?.jsDoc !== "none" && hasJsDocTag(node, "internal")) {
            return false;
        }
        const localSymbol = localSymbolAtNode(node);
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }
    protected isGenericType(node: ts.TypeAliasDeclaration): boolean {
        return !!(node.typeParameters && node.typeParameters.length > 0);
    }
    protected getFullName(node: ts.Node, typeChecker: ts.TypeChecker): string {
        const symbol = symbolAtNode(node)!;
        return typeChecker.getFullyQualifiedName(symbol).replace(/".*"\./, "");
    }
}
