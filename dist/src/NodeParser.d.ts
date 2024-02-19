import ts from "typescript";
import { BaseType } from "./Type/BaseType";
import { ReferenceType } from "./Type/ReferenceType";
export declare class Context {
    private cacheKey;
    private arguments;
    private parameters;
    private reference?;
    private defaultArgument;
    constructor(reference?: ts.Node);
    pushArgument(argumentType: BaseType): void;
    pushParameter(parameterName: string): void;
    setDefault(parameterName: string, argumentType: BaseType): void;
    getCacheKey(): string;
    getArgument(parameterName: string): BaseType;
    getParameters(): readonly string[];
    getArguments(): readonly BaseType[];
    getReference(): ts.Node | undefined;
}
export interface NodeParser {
    createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType;
}
