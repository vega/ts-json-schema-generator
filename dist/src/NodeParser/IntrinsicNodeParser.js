"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntrinsicNodeParser = exports.intrinsicMethods = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const Errors_js_1 = require("../Error/Errors.js");
const LiteralType_js_1 = require("../Type/LiteralType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const extractLiterals_js_1 = require("../Utils/extractLiterals.js");
exports.intrinsicMethods = {
    Uppercase: (v) => v.toUpperCase(),
    Lowercase: (v) => v.toLowerCase(),
    Capitalize: (v) => v[0].toUpperCase() + v.slice(1),
    Uncapitalize: (v) => v[0].toLowerCase() + v.slice(1),
};
class IntrinsicNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.IntrinsicKeyword;
    }
    createType(node, context) {
        const methodName = getParentName(node);
        const method = exports.intrinsicMethods[methodName];
        if (!method) {
            throw new Errors_js_1.LogicError(node, `Unknown intrinsic method: ${methodName}`);
        }
        const literals = (0, extractLiterals_js_1.extractLiterals)(context.getArguments()[0])
            .map(method)
            .map((literal) => new LiteralType_js_1.LiteralType(literal));
        if (literals.length === 1) {
            return literals[0];
        }
        return new UnionType_js_1.UnionType(literals);
    }
}
exports.IntrinsicNodeParser = IntrinsicNodeParser;
function getParentName(node) {
    const parent = node.parent;
    if (!typescript_1.default.isTypeAliasDeclaration(parent)) {
        throw new Errors_js_1.LogicError(node, "Only intrinsics part of a TypeAliasDeclaration are supported.");
    }
    return parent.name.text;
}
//# sourceMappingURL=IntrinsicNodeParser.js.map