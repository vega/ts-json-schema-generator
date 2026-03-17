"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnhandledError = exports.BuildError = exports.DefinitionError = exports.JsonTypeError = exports.ExpectationFailedError = exports.LogicError = exports.MultipleDefinitionsError = exports.RootlessError = exports.UnknownTypeError = exports.UnknownNodeError = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const BaseError_js_1 = require("./BaseError.js");
class UnknownNodeError extends BaseError_js_1.BaseError {
    node;
    constructor(node) {
        super({
            code: 100,
            node,
            messageText: `Unknown node of kind "${typescript_1.default.SyntaxKind[node.kind]}"`,
        });
        this.node = node;
    }
}
exports.UnknownNodeError = UnknownNodeError;
class UnknownTypeError extends BaseError_js_1.BaseError {
    type;
    constructor(type) {
        super({
            code: 101,
            messageText: `Unknown type "${type?.getId()}"`,
        });
        this.type = type;
    }
}
exports.UnknownTypeError = UnknownTypeError;
class RootlessError extends BaseError_js_1.BaseError {
    fullName;
    constructor(fullName) {
        super({
            code: 102,
            messageText: `No root type "${fullName}" found`,
        });
        this.fullName = fullName;
    }
}
exports.RootlessError = RootlessError;
class MultipleDefinitionsError extends BaseError_js_1.BaseError {
    name;
    defA;
    defB;
    constructor(name, defA, defB) {
        super({
            code: 103,
            messageText: `Type "${name}" has multiple definitions.`,
        });
        this.name = name;
        this.defA = defA;
        this.defB = defB;
    }
}
exports.MultipleDefinitionsError = MultipleDefinitionsError;
class LogicError extends BaseError_js_1.BaseError {
    node;
    constructor(node, messageText) {
        super({
            code: 104,
            messageText,
            node,
        });
        this.node = node;
    }
}
exports.LogicError = LogicError;
class ExpectationFailedError extends BaseError_js_1.BaseError {
    node;
    constructor(messageText, node) {
        super({
            code: 105,
            messageText,
            node,
        });
        this.node = node;
    }
}
exports.ExpectationFailedError = ExpectationFailedError;
class JsonTypeError extends BaseError_js_1.BaseError {
    type;
    constructor(messageText, type) {
        super({
            code: 106,
            messageText,
        });
        this.type = type;
    }
}
exports.JsonTypeError = JsonTypeError;
class DefinitionError extends BaseError_js_1.BaseError {
    definition;
    constructor(messageText, definition) {
        super({
            code: 107,
            messageText,
        });
        this.definition = definition;
    }
}
exports.DefinitionError = DefinitionError;
class BuildError extends BaseError_js_1.BaseError {
    constructor(diag) {
        super({
            code: 108,
            ...diag,
        });
    }
}
exports.BuildError = BuildError;
class UnhandledError extends BaseError_js_1.BaseError {
    cause;
    constructor(messageText, node, cause) {
        super({ code: 109, messageText, node });
        this.cause = cause;
    }
    /**
     * Creates a new error with a cause and optional node information and ensures it is not wrapped in another UnhandledError
     */
    static from(message, node, cause) {
        // This might be called deeply inside the parser chain
        // this ensures it doesn't end up with error.cause.cause.cause...
        return cause instanceof BaseError_js_1.BaseError ? cause : new UnhandledError(message, node, cause);
    }
}
exports.UnhandledError = UnhandledError;
//# sourceMappingURL=Errors.js.map