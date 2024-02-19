"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntrinsicNodeParser = exports.intrinsicMethods = void 0;
const typescript_1 = __importDefault(require("typescript"));
const LiteralType_1 = require("../Type/LiteralType");
const UnionType_1 = require("../Type/UnionType");
const assert_1 = __importDefault(require("../Utils/assert"));
const extractLiterals_1 = require("../Utils/extractLiterals");
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
        (0, assert_1.default)(method, `Unknown intrinsic method: ${methodName}`);
        const literals = (0, extractLiterals_1.extractLiterals)(context.getArguments()[0])
            .map(method)
            .map((literal) => new LiteralType_1.LiteralType(literal));
        if (literals.length === 1) {
            return literals[0];
        }
        return new UnionType_1.UnionType(literals);
    }
}
exports.IntrinsicNodeParser = IntrinsicNodeParser;
function getParentName(node) {
    const parent = node.parent;
    (0, assert_1.default)(typescript_1.default.isTypeAliasDeclaration(parent), "Only intrinsics part of a TypeAliasDeclaration are supported.");
    return parent.name.text;
}
//# sourceMappingURL=IntrinsicNodeParser.js.map