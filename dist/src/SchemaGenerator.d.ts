import * as ts from "typescript";
import { NodeParser } from "./NodeParser";
import { Schema } from "./Schema/Schema";
import { TypeFormatter } from "./TypeFormatter";
export declare class SchemaGenerator {
    private program;
    private nodeParser;
    private typeFormatter;
    constructor(program: ts.Program, nodeParser: NodeParser, typeFormatter: TypeFormatter);
    createSchema(fullName: string): Schema;
    private findRootNode(fullName);
    private inspectNode(node, typeChecker, allTypes);
    private isExportType(node);
    private isGenericType(node);
    private getFullName(node, typeChecker);
    private getRootTypeDefinition(rootType);
    private getRootChildDefinitions(rootType);
}
