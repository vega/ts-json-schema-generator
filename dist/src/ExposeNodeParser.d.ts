import ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { ReferenceType } from "./Type/ReferenceType";
export declare class ExposeNodeParser implements SubNodeParser {
    protected typeChecker: ts.TypeChecker;
    protected subNodeParser: SubNodeParser;
    protected expose: "all" | "none" | "export";
    protected jsDoc: "none" | "extended" | "basic";
    constructor(typeChecker: ts.TypeChecker, subNodeParser: SubNodeParser, expose: "all" | "none" | "export", jsDoc: "none" | "extended" | "basic");
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType;
    protected isExportNode(node: ts.Node): boolean;
    protected getDefinitionName(node: ts.Node, context: Context): string;
}
