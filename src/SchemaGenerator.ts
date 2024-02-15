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
import { unambiguousName } from "./Utils/unambiguousName";
import { resolveIdRefs } from "./Utils/resolveIdRefs";
import { JSONSchema7 } from "json-schema";

export class SchemaGenerator {
    public constructor(
        protected readonly program: ts.Program,
        protected readonly nodeParser: NodeParser,
        protected readonly typeFormatter: TypeFormatter,
        protected readonly config?: Config
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
        // Definitions will be referred to by their ID.
        // This "ID → name" map will be used to resolve object
        // names before delivering the final schema to caller.
        const idToNameMap = new Map<string, string>();

        rootTypes.forEach((rootType) => this.appendRootChildDefinitions(rootType, definitions, idToNameMap));

        const reachableDefinitions = removeUnreachable(rootTypeDefinition, definitions);

        const schema = {
            ...(this.config?.schemaId ? { $id: this.config.schemaId } : {}),
            $schema: "http://json-schema.org/draft-07/schema#",
            ...(rootTypeDefinition ?? {}),
            definitions: reachableDefinitions,
        };

        // Finally, replace all IDs by their actual names.
        return resolveIdRefs(schema, idToNameMap, this.config?.encodeRefs ?? true) as JSONSchema7;
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
    protected appendRootChildDefinitions(rootType: BaseType, childDefinitions: StringMap<Definition>, idToNameMap: Map<string, string>): void {
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

        // identify duplicated definitions. ie: definitions with distinct
        // origins but sharing the same name
        const duplicates: StringMap<Set<DefinitionType>> = {};
        for (const child of children) {
            const name = child.getName();
            duplicates[name] ??= new Set<DefinitionType>();
            duplicates[name].add(child);
        }

        // for duplicated definitions, lift the name ambiguity by renaming them.
        children.reduce((definitions, child) => {
            const id = child.getId();
            if (!(id in definitions)) {
                const name = unambiguousName(child, child === rootType, [...duplicates[child.getName()]]);

                // associate the schema to its ID, allowing steps like removeUnreachable to work
                definitions[id] = this.typeFormatter.getDefinition(child.getType());

                // this ID → name map will be used in the final step, to resolve object
                // names before delivering the final schema to caller
                idToNameMap.set(id, name);
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
