import type { JSONSchema7 } from "json-schema";
import ts from "typescript";
import type { BaseType } from "../Type/BaseType.js";
import { BaseError, type PartialDiagnostic } from "./BaseError.js";
export declare class UnknownNodeError extends BaseError {
    readonly node: ts.Node;
    constructor(node: ts.Node);
}
export declare class UnknownTypeError extends BaseError {
    readonly type: BaseType;
    constructor(type: BaseType);
}
export declare class RootlessError extends BaseError {
    readonly fullName: string;
    constructor(fullName: string);
}
export declare class MultipleDefinitionsError extends BaseError {
    readonly name: string;
    readonly defA: BaseType;
    readonly defB?: BaseType | undefined;
    constructor(name: string, defA: BaseType, defB?: BaseType | undefined);
}
export declare class LogicError extends BaseError {
    readonly node: ts.Node;
    constructor(node: ts.Node, messageText: string);
}
export declare class ExpectationFailedError extends BaseError {
    readonly node?: ts.Node | undefined;
    constructor(messageText: string, node?: ts.Node | undefined);
}
export declare class JsonTypeError extends BaseError {
    readonly type: BaseType;
    constructor(messageText: string, type: BaseType);
}
export declare class DefinitionError extends BaseError {
    readonly definition: JSONSchema7;
    constructor(messageText: string, definition: JSONSchema7);
}
export declare class BuildError extends BaseError {
    constructor(diag: Omit<PartialDiagnostic, "code">);
}
export declare class UnhandledError extends BaseError {
    readonly cause?: unknown | undefined;
    private constructor();
    /**
     * Creates a new error with a cause and optional node information and ensures it is not wrapped in another UnhandledError
     */
    static from(message: string, node?: ts.Node, cause?: unknown): BaseError | UnhandledError;
}
