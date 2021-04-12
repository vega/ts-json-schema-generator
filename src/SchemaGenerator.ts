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
import { notUndefined } from "./Utils/notUndefined";
import { removeUnreachable } from "./Utils/removeUnreachable";
import { Config } from "./Config";
import { hasJsDocTag } from "./Utils/hasJsDocTag";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { unambiguousName } from "./Utils/unambiguousName";
import { resolveIdRefs } from "./Utils/resolveIdRefs";

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
        const rootTypes = rootNodes
            .map((rootNode) => {
                return this.nodeParser.createType(rootNode, new Context());
            })
            .filter(notUndefined);
        const rootTypeDefinition = rootTypes.length === 1 ? this.getRootTypeDefinition(rootTypes[0]) : undefined;
        const definitions: StringMap<Definition> = {};
        const idNameMap = new Map<string, string>();

        rootTypes.forEach((rootType) => this.appendRootChildDefinitions(rootType, definitions, idNameMap));
        const reachableDefinitions = removeUnreachable(rootTypeDefinition, definitions);

        // create schema - all $ref's use getId().
        const schema: JSONSchema7Definition = {
            ...(this.config?.schemaId ? { $id: this.config.schemaId } : {}),
            $schema: "http://json-schema.org/draft-07/schema#",
            ...(rootTypeDefinition ?? {}),
            definitions: reachableDefinitions,
        };
        // Finally, replace all getId() by their equivalent names.
        return resolveIdRefs(schema, idNameMap, this.config?.encodeRefs ?? true) as JSONSchema7;
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
    protected appendRootChildDefinitions(
        rootType: BaseType,
        childDefinitions: StringMap<Definition>,
        idNameMap: Map<string, string>
    ): void {
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

        const duplicates: StringMap<Set<DefinitionType>> = {};
        for (const child of children) {
            const name = child.getName();
            duplicates[name] = duplicates[name] ?? new Set<DefinitionType>();
            duplicates[name].add(child);
        }

        children.reduce((definitions, child) => {
            const id = child.getId().replace(/^def-/, "");
            if (!(id in definitions)) {
                const name = unambiguousName(child, child === rootType, [...duplicates[child.getName()]]);
                // Record the schema against the ID, allowing steps like removeUnreachable to work
                definitions[id] = this.typeFormatter.getDefinition(child.getType());
                // Create a record of id->name mapping. This is used in the final step
                // to resolve id -> name before delivering the schema to caller.
                idNameMap.set(id, name);
            }
            return definitions;
        }, childDefinitions);
    }
    protected partitionFiles(): { projectFiles: ts.SourceFile[]; externalFiles: ts.SourceFile[] } {
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
