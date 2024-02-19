"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExposeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const DefinitionType_1 = require("./Type/DefinitionType");
const hasJsDocTag_1 = require("./Utils/hasJsDocTag");
const symbolAtNode_1 = require("./Utils/symbolAtNode");
class ExposeNodeParser {
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
        return new DefinitionType_1.DefinitionType(this.getDefinitionName(node, context), baseType);
    }
    isExportNode(node) {
        if (this.expose === "all") {
            return node.kind !== typescript_1.default.SyntaxKind.TypeLiteral;
        }
        else if (this.expose === "none") {
            return false;
        }
        else if (this.jsDoc !== "none" && (0, hasJsDocTag_1.hasJsDocTag)(node, "internal")) {
            return false;
        }
        const localSymbol = node.localSymbol;
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }
    getDefinitionName(node, context) {
        const symbol = (0, symbolAtNode_1.symbolAtNode)(node);
        const fullName = this.typeChecker.getFullyQualifiedName(symbol).replace(/^".*"\./, "");
        const argumentIds = context.getArguments().map((arg) => arg === null || arg === void 0 ? void 0 : arg.getName());
        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
exports.ExposeNodeParser = ExposeNodeParser;
//# sourceMappingURL=ExposeNodeParser.js.map