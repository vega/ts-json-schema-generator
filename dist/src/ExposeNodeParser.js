"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var DefinitionType_1 = require("./Type/DefinitionType");
var ExposeNodeParser = (function () {
    function ExposeNodeParser(typeChecker, subNodeParser, expose) {
        this.typeChecker = typeChecker;
        this.subNodeParser = subNodeParser;
        this.expose = expose;
    }
    ExposeNodeParser.prototype.supportsNode = function (node) {
        return this.subNodeParser.supportsNode(node);
    };
    ExposeNodeParser.prototype.createType = function (node, context) {
        var baseType = this.subNodeParser.createType(node, context);
        if (!this.isExportNode(node)) {
            return baseType;
        }
        return new DefinitionType_1.DefinitionType(this.getDefinitionName(node, context), baseType);
    };
    ExposeNodeParser.prototype.isExportNode = function (node) {
        if (this.expose === "all") {
            return true;
        }
        else if (this.expose === "none") {
            return false;
        }
        var localSymbol = node.localSymbol;
        return localSymbol ? (localSymbol.flags & ts.SymbolFlags.ExportType) !== 0 : false;
    };
    ExposeNodeParser.prototype.getDefinitionName = function (node, context) {
        var fullName = this.typeChecker.getFullyQualifiedName(node.symbol).replace(/^".*"\./, "");
        var argumentIds = context.getArguments().map(function (arg) { return arg.getId(); });
        return argumentIds.length ? fullName + "<" + argumentIds.join(",") + ">" : fullName;
    };
    return ExposeNodeParser;
}());
exports.ExposeNodeParser = ExposeNodeParser;
//# sourceMappingURL=ExposeNodeParser.js.map