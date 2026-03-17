"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateLiteralNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const LiteralType_js_1 = require("../Type/LiteralType.js");
const TemplateLiteralType_js_1 = require("../Type/TemplateLiteralType.js");
const NeverType_js_1 = require("../Type/NeverType.js");
const extractLiterals_js_1 = require("../Utils/extractLiterals.js");
const StringType_js_1 = require("../Type/StringType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const isExtendsType_js_1 = require("../Utils/isExtendsType.js");
class TemplateLiteralNodeParser {
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
        const types = [];
        const prefix = node.head.text;
        if (prefix) {
            types.push(new LiteralType_js_1.LiteralType(prefix));
        }
        for (const span of node.templateSpans) {
            types.push(this.childNodeParser.createType(span.type, context));
            const suffix = span.literal.text;
            if (suffix) {
                types.push(new LiteralType_js_1.LiteralType(suffix));
            }
        }
        if ((0, isExtendsType_js_1.isExtendsType)(node)) {
            return new TemplateLiteralType_js_1.TemplateLiteralType(types);
        }
        return this.expandTypes(types);
    }
    expandTypes(types) {
        let expanded = [""];
        for (const type of types) {
            if (type instanceof NeverType_js_1.NeverType) {
                return new NeverType_js_1.NeverType();
            }
            try {
                const literals = (0, extractLiterals_js_1.extractLiterals)(type);
                expanded = expanded.flatMap((prefix) => literals.map((suffix) => prefix + suffix));
            }
            catch {
                return new StringType_js_1.StringType();
            }
        }
        if (expanded.length === 1) {
            return new LiteralType_js_1.LiteralType(expanded[0]);
        }
        return new UnionType_js_1.UnionType(expanded.map((literal) => new LiteralType_js_1.LiteralType(literal)));
    }
}
exports.TemplateLiteralNodeParser = TemplateLiteralNodeParser;
//# sourceMappingURL=TemplateLiteralNodeParser.js.map