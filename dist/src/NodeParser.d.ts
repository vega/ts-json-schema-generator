import * as ts from "typescript";
import { BaseType } from "./Type/BaseType";
export declare class Context {
    private arguments;
    private parameters;
    private reference?;
    constructor(reference?: ts.Node);
    pushArgument(argumentType: BaseType): void;
    pushParameter(parameterName: string): void;
    getArgument(parameterName: string): BaseType;
    getArguments(): BaseType[];
    getReference(): ts.Node | undefined;
}
export interface NodeParser {
    createType(node: ts.Node, context: Context): BaseType;
}
