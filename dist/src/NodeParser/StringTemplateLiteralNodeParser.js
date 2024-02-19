"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringTemplateLiteralNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const UnknownTypeError_1 = require("../Error/UnknownTypeError");
const LiteralType_1 = require("../Type/LiteralType");
const StringType_1 = require("../Type/StringType");
const UnionType_1 = require("../Type/UnionType");
const extractLiterals_1 = require("../Utils/extractLiterals");
class StringTemplateLiteralNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return (node.kind === typescript_1.default.SyntaxKind.NoSubstitutionTemplateLiteral || node.kind === typescript_1.default.SyntaxKind.TemplateLiteralType);
    }
    createType(node, context) {
        if (node.kind === typescript_1.default.SyntaxKind.NoSubstitutionTemplateLiteral) {
            return new LiteralType_1.LiteralType(node.text);
        }
        try {
            const prefix = node.head.text;
            const matrix = [[prefix]].concat(node.templateSpans.map((span) => {
                const suffix = span.literal.text;
                const type = this.childNodeParser.createType(span.type, context);
                return (0, extractLiterals_1.extractLiterals)(type).map((value) => value + suffix);
            }));
            const expandedLiterals = expand(matrix);
            const expandedTypes = expandedLiterals.map((literal) => new LiteralType_1.LiteralType(literal));
            if (expandedTypes.length === 1) {
                return expandedTypes[0];
            }
            return new UnionType_1.UnionType(expandedTypes);
        }
        catch (error) {
            if (error instanceof UnknownTypeError_1.UnknownTypeError) {
                return new StringType_1.StringType();
            }
            throw error;
        }
    }
}
exports.StringTemplateLiteralNodeParser = StringTemplateLiteralNodeParser;
function expand(matrix) {
    if (matrix.length === 1) {
        return matrix[0];
    }
    const head = matrix[0];
    const nested = expand(matrix.slice(1));
    const combined = head.map((prefix) => nested.map((suffix) => prefix + suffix));
    return [].concat(...combined);
}
//# sourceMappingURL=StringTemplateLiteralNodeParser.js.map