import ts from "typescript";
import { type PartialDiagnostic, BaseError } from "./BaseError.js";
import type { BaseType } from "../Type/BaseType.js";
import type { JSONSchema7 } from "json-schema";

export class UnknownNodeError extends BaseError {
    constructor(readonly node: ts.Node) {
        super({
            code: 100,
            node,
            messageText: `Unknown node of kind "${ts.SyntaxKind[node.kind]}"`,
        });
    }
}

export class UnknownTypeError extends BaseError {
    constructor(readonly type: BaseType) {
        super({
            code: 101,
            messageText: `Unknown type "${type?.getId()}"`,
        });
    }
}

export class RootlessError extends BaseError {
    constructor(readonly fullName: string) {
        super({
            code: 102,
            messageText: `No root type "${fullName}" found`,
        });
    }
}

export class MultipleDefinitionsError extends BaseError {
    constructor(
        readonly name: string,
        readonly defA: BaseType,
        readonly defB?: BaseType,
    ) {
        super({
            code: 103,
            messageText: `Type "${name}" has multiple definitions.`,
        });
    }
}

export class LogicError extends BaseError {
    constructor(
        readonly node: ts.Node,
        messageText: string,
    ) {
        super({
            code: 104,
            messageText,
            node,
        });
    }
}

export class ExpectationFailedError extends BaseError {
    constructor(
        messageText: string,
        readonly node?: ts.Node,
    ) {
        super({
            code: 105,
            messageText,
            node,
        });
    }
}

export class JsonTypeError extends BaseError {
    constructor(
        messageText: string,
        readonly type: BaseType,
    ) {
        super({
            code: 106,
            messageText,
        });
    }
}

export class DefinitionError extends BaseError {
    constructor(
        messageText: string,
        readonly definition: JSONSchema7,
    ) {
        super({
            code: 107,
            messageText,
        });
    }
}

export class BuildError extends BaseError {
    constructor(diag: Omit<PartialDiagnostic, "code">) {
        super({
            code: 108,
            ...diag,
        });
    }
}
