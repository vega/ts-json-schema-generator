"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const Errors_js_1 = require("../Error/Errors.js");
/**
 * Resolves identifiers whose value is a compile-time constant
 */
class IdentifierNodeParser {
    childNodeParser;
    checker;
    constructor(childNodeParser, checker) {
        this.childNodeParser = childNodeParser;
        this.checker = checker;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.Identifier;
    }
    createType(node, context) {
        const symbol = this.checker.getSymbolAtLocation(node);
        if (!symbol) {
            throw new Errors_js_1.UnknownNodeError(node);
        }
        const decl = symbol.valueDeclaration;
        if (decl &&
            typescript_1.default.isVariableDeclaration(decl) &&
            decl.initializer &&
            typescript_1.default.getCombinedNodeFlags(decl) & typescript_1.default.NodeFlags.Const) {
            return this.childNodeParser.createType(decl.initializer, context);
        }
        throw new Errors_js_1.UnknownNodeError(node);
    }
}
exports.IdentifierNodeParser = IdentifierNodeParser;
//# sourceMappingURL=IdentifierNodeParser.js.map