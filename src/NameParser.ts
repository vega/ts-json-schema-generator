import * as ts from "typescript";
import { Context } from "./NodeParser";

export interface NameParser {
    isExportNode(node: ts.Node): boolean;
    getTypeId(node: ts.Node, context: Context): string;
    getDefinitionName(node: ts.Node, context: Context): string;
}
