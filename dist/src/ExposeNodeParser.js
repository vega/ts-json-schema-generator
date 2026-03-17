"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExposeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const DefinitionType_js_1 = require("./Type/DefinitionType.js");
const hasJsDocTag_js_1 = require("./Utils/hasJsDocTag.js");
const symbolAtNode_js_1 = require("./Utils/symbolAtNode.js");
class ExposeNodeParser {
    typeChecker;
    subNodeParser;
    expose;
    jsDoc;
    constructor(typeChecker, subNodeParser, expose, jsDoc) {
        this.typeChecker = typeChecker;
        this.subNodeParser = subNodeParser;
        this.expose = expose;
        this.jsDoc = jsDoc;
    }
    supportsNode(node) {
        return this.subNodeParser.supportsNode(node);
    }
    createType(node, context, reference) {
        const baseType = this.subNodeParser.createType(node, context, reference);
        if (!this.isExportNode(node)) {
            return baseType;
        }
        return new DefinitionType_js_1.DefinitionType(this.getDefinitionName(node, context), baseType);
    }
    isExportNode(node) {
        if (this.expose === "all") {
            return node.kind !== typescript_1.default.SyntaxKind.TypeLiteral;
        }
        else if (this.expose === "none") {
            return false;
        }
        else if (this.jsDoc !== "none" && (0, hasJsDocTag_js_1.hasJsDocTag)(node, "internal")) {
            return false;
        }
        const localSymbol = node.localSymbol;
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }
    getDefinitionName(node, context) {
        const symbol = (0, symbolAtNode_js_1.symbolAtNode)(node);
        const fullName = this.typeChecker.getFullyQualifiedName(symbol).replace(/^".*"\./, "");
        const argumentIds = context.getArguments().map((arg) => arg?.getName());
        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
exports.ExposeNodeParser = ExposeNodeParser;
//# sourceMappingURL=ExposeNodeParser.js.map