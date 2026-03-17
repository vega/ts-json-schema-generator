"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringTemplateLiteralNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const LiteralType_js_1 = require("../Type/LiteralType.js");
const StringType_js_1 = require("../Type/StringType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const extractLiterals_js_1 = require("../Utils/extractLiterals.js");
const Errors_js_1 = require("../Error/Errors.js");
class StringTemplateLiteralNodeParser {
    childNodeParser;
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return (node.kind === typescript_1.default.SyntaxKind.NoSubstitutionTemplateLiteral || node.kind === typescript_1.default.SyntaxKind.TemplateLiteralType);
    }
    createType(node, context) {
        if (node.kind === typescript_1.default.SyntaxKind.NoSubstitutionTemplateLiteral) {
            return new LiteralType_js_1.LiteralType(node.text);
        }
        try {
            const prefix = node.head.text;
            const matrix = [[prefix]].concat(node.templateSpans.map((span) => {
                const suffix = span.literal.text;
                const type = this.childNodeParser.createType(span.type, context);
                return (0, extractLiterals_js_1.extractLiterals)(type).map((value) => value + suffix);
            }));
            const expandedLiterals = expand(matrix);
            const expandedTypes = expandedLiterals.map((literal) => new LiteralType_js_1.LiteralType(literal));
            if (expandedTypes.length === 1) {
                return expandedTypes[0];
            }
            return new UnionType_js_1.UnionType(expandedTypes);
        }
        catch (error) {
            if (error instanceof Errors_js_1.UnknownTypeError) {
                return new StringType_js_1.StringType();
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