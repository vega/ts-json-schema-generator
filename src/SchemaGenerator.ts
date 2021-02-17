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

        if (true) {
            // TODO: remove this.
            console.log(
                JSON.stringify(
                    {
                        rootTypeDefinition,
                        definitions,
                        reachableDefinitions,
                    },
                    null,
                    2
                )
            );
            console.log(idNameMap);
        }

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
            const name = child.getName(); // .replace(/^def-interface/, "interface");
            duplicates[name] = duplicates[name] ?? new Set<DefinitionType>();
            duplicates[name].add(child);
        }

        children.reduce((definitions, child) => {
            const id = child.getId(); // .replace(/^def-interface/, "interface");
            if (!(id in definitions)) {
                // Record the schema against the ID, allowing steps like removeUnreachable to work
                definitions[id] = this.typeFormatter.getDefinition(child.getType());
                // Create a record of id->name mapping. This is used in the final step
                // to resolve id -> name before delivering the schema to caller.
                const name = unambiguousName(child, child === rootType, [...duplicates[child.getName()]]);
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

/**
 * Given a set of paths, will strip the common-prefix, and return an array of remaining substrings.
 * Also removes any file extensions, and replaces any '/' with '-' in the path.
 * Each return value can be used as a name prefix for disambiguation.
 * The returned prefixes array maintains input order.
 */
function getCommonPrefixes(paths: string[]) {
    // clone before sorting to maintain input order.
    const sorted = [...paths].sort();
    const shortest = sorted[0];
    const second = sorted[sorted.length - 1];
    const maxPrefix = shortest.length;
    let pos = 0;
    let path_pos = 0;
    while (pos < maxPrefix && shortest.charAt(pos) === second.charAt(pos)) {
        if (shortest.charAt(pos) === "/") {
            path_pos = pos;
        }
        pos++;
    }
    return paths.map((p) =>
        p
            .substr(path_pos + 1)
            .replace(/\//g, "__")
            .replace(/\.[^.]+$/, "")
    );
}

function unambiguousName(child: DefinitionType, isRoot: boolean, peers: DefinitionType[]) {
    if (peers.length === 1 || isRoot) {
        return child.getName();
    } else {
        let index = -1;
        const srcPaths = peers.map((peer: DefinitionType, count) => {
            index = child === peer ? count : index;
            return peer.getType().getSrcFileName();
        });
        const prefixes = getCommonPrefixes(srcPaths);
        return `${prefixes[index]}-${child.getName()}`;
    }
}

/**
 * Resolve all `#/definitions/...` and `$ref` in schema with appropriate disambiguated names
 */
function resolveIdRefs(
    schema: JSONSchema7Definition,
    idNameMap: Map<string, string>,
    encodeRefs: boolean
): JSONSchema7Definition {
    if (!schema || typeof schema === "boolean") {
        return schema;
    }
    const { $ref, allOf, oneOf, anyOf, not, properties, items, definitions, additionalProperties, ...rest } = schema;
    const result: JSONSchema7Definition = { ...rest };
    if ($ref) {
        // THE Money Shot.
        const id = encodeRefs ? decodeURIComponent($ref.slice(14)) : $ref.slice(14);
        const name = idNameMap.get(id);
        result.$ref = `#/definitions/${encodeRefs ? encodeURIComponent(name!) : name}`;
    }
    if (definitions) {
        result.definitions = Object.entries(definitions).reduce((acc, [prop, value]) => {
            const name = idNameMap.get(prop)!;
            acc[name] = resolveIdRefs(value, idNameMap, encodeRefs);
            return acc;
        }, {} as StringMap<JSONSchema7Definition>);
    }
    if (properties) {
        result.properties = Object.entries(properties).reduce((acc, [prop, value]) => {
            acc[prop] = resolveIdRefs(value, idNameMap, encodeRefs);
            return acc;
        }, {} as StringMap<JSONSchema7Definition>);
    }
    if (additionalProperties || additionalProperties === false) {
        result.additionalProperties = resolveIdRefs(additionalProperties, idNameMap, encodeRefs);
    }
    if (items) {
        result.items = Array.isArray(items)
            ? items.map((el) => resolveIdRefs(el, idNameMap, encodeRefs))
            : resolveIdRefs(items, idNameMap, encodeRefs);
    }
    if (allOf) {
        result.allOf = allOf.map((el) => resolveIdRefs(el, idNameMap, encodeRefs));
    }
    if (anyOf) {
        result.anyOf = anyOf.map((el) => resolveIdRefs(el, idNameMap, encodeRefs));
    }
    if (oneOf) {
        result.oneOf = oneOf.map((el) => resolveIdRefs(el, idNameMap, encodeRefs));
    }
    if (not) {
        result.not = resolveIdRefs(not, idNameMap, encodeRefs);
    }
    return result;
}
