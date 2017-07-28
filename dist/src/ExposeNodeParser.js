"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const DefinitionType_1 = require("./Type/DefinitionType");
class ExposeNodeParser {
    constructor(typeChecker, subNodeParser, expose) {
        this.typeChecker = typeChecker;
        this.subNodeParser = subNodeParser;
        this.expose = expose;
    }
    supportsNode(node) {
        return this.subNodeParser.supportsNode(node);
    }
    createType(node, context) {
        const baseType = this.subNodeParser.createType(node, context);
        if (!this.isExportNode(node)) {
            return baseType;
        }
        return new DefinitionType_1.DefinitionType(this.getDefinitionName(node, context), baseType);
    }
    isExportNode(node) {
        if (this.expose === "all") {
            return true;
        }
        else if (this.expose === "none") {
            return false;
        }
        const localSymbol = node.localSymbol;
        return localSymbol ? (localSymbol.flags & ts.SymbolFlags.ExportType) !== 0 : false;
    }
    getDefinitionName(node, context) {
        const fullName = this.typeChecker.getFullyQualifiedName(node.symbol).replace(/^".*"\./, "");
        const argumentIds = context.getArguments().map((arg) => arg.getId());
        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
exports.ExposeNodeParser = ExposeNodeParser;
//# sourceMappingURL=ExposeNodeParser.js.map