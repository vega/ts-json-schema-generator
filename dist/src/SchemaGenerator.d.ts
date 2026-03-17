import ts from "typescript";
import type { Config } from "./Config.js";
import { type NodeParser } from "./NodeParser.js";
import type { Definition } from "./Schema/Definition.js";
import type { Schema } from "./Schema/Schema.js";
import type { BaseType } from "./Type/BaseType.js";
import type { TypeFormatter } from "./TypeFormatter.js";
import type { StringMap } from "./Utils/StringMap.js";
export declare class SchemaGenerator {
    protected readonly program: ts.Program;
    protected readonly nodeParser: NodeParser;
    protected readonly typeFormatter: TypeFormatter;
    protected readonly config?: Config | undefined;
    constructor(program: ts.Program, nodeParser: NodeParser, typeFormatter: TypeFormatter, config?: Config | undefined);
    createSchema(fullNames?: string | string[]): Schema;
    createSchemaFromNodes(rootNodes: ts.Node[]): Schema;
    protected getRootNodes(fullNames: string[] | undefined): ts.Node[];
    protected findNamedNode(fullName: string): ts.Node;
    protected getRootTypeDefinition(rootType: BaseType, rootNode: ts.Node, definitions?: StringMap<Definition>): Definition;
    protected appendRootChildDefinitions(rootType: BaseType, childDefinitions: StringMap<Definition>): void;
    protected partitionFiles(): {
        projectFiles: ts.SourceFile[];
        externalFiles: ts.SourceFile[];
    };
    protected appendTypes(sourceFiles: readonly ts.SourceFile[], typeChecker: ts.TypeChecker, types: Map<string, ts.Node>): void;
    protected inspectNode(node: ts.Node, typeChecker: ts.TypeChecker, allTypes: Map<string, ts.Node>): void;
    protected isExportType(node: ts.InterfaceDeclaration | ts.ClassDeclaration | ts.EnumDeclaration | ts.TypeAliasDeclaration): boolean;
    protected isGenericType(node: ts.TypeAliasDeclaration): boolean;
    protected getFullName(node: ts.Declaration, typeChecker: ts.TypeChecker): string;
}
