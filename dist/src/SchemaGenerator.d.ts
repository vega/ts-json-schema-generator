import ts from "typescript";
import { NodeParser } from "./NodeParser";
import { Definition } from "./Schema/Definition";
import { Schema } from "./Schema/Schema";
import { BaseType } from "./Type/BaseType";
import { TypeFormatter } from "./TypeFormatter";
import { StringMap } from "./Utils/StringMap";
import { Config } from "./Config";
export declare class SchemaGenerator {
    protected readonly program: ts.Program;
    protected readonly nodeParser: NodeParser;
    protected readonly typeFormatter: TypeFormatter;
    protected readonly config?: Config | undefined;
    constructor(program: ts.Program, nodeParser: NodeParser, typeFormatter: TypeFormatter, config?: Config | undefined);
    createSchema(fullName?: string): Schema;
    createSchemaFromNodes(rootNodes: ts.Node[]): Schema;
    protected getRootNodes(fullName: string | undefined): ts.Node[];
    protected findNamedNode(fullName: string): ts.Node;
    protected getRootTypeDefinition(rootType: BaseType): Definition;
    protected appendRootChildDefinitions(rootType: BaseType, childDefinitions: StringMap<Definition>): void;
    protected partitionFiles(): {
        projectFiles: ts.SourceFile[];
        externalFiles: ts.SourceFile[];
    };
    protected appendTypes(sourceFiles: readonly ts.SourceFile[], typeChecker: ts.TypeChecker, types: Map<string, ts.Node>): void;
    protected inspectNode(node: ts.Node, typeChecker: ts.TypeChecker, allTypes: Map<string, ts.Node>): void;
    protected isExportType(node: ts.Node): boolean;
    protected isGenericType(node: ts.TypeAliasDeclaration): boolean;
    protected getFullName(node: ts.Node, typeChecker: ts.TypeChecker): string;
}
