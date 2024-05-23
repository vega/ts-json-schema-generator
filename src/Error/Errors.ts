import ts from "typescript";
import { PartialDiagnostic, TJSGError } from "./BaseError.js";
import type { BaseType } from "../Type/BaseType.js";
import { JSONSchema7 } from "json-schema";

export class UnknownNodeTJSGError extends TJSGError {
    constructor(readonly node: ts.Node) {
        super({
            code: 100,
            node,
            messageText: `Unknown node of kind "${ts.SyntaxKind[node.kind]}"`,
        });
    }
}

export class UnknownTypeTJSGError extends TJSGError {
    constructor(readonly type: BaseType) {
        super({
            code: 101,
            messageText: `Unknown type "${type.getId()}"`,
        });
    }
}

export class RootlessTJSGError extends TJSGError {
    constructor(readonly fullName: string) {
        super({
            code: 102,
            messageText: `No root files could be found for: ${fullName}`,
        });
    }
}

export class MultipleDefinitionsTJSGError extends TJSGError {
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

export class LogicTJSGError extends TJSGError {
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

export class ExpectationFailedTJSGError extends TJSGError {
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

export class TypeTJSGError extends TJSGError {
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

export class DefinitionTJSGError extends TJSGError {
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
export class BuildTJSGError extends TJSGError {
    constructor(diag: Omit<PartialDiagnostic, "code">) {
        super({
            code: 108,
            ...diag,
        });
    }
}
