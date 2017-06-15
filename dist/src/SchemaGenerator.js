"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var NoRootTypeError_1 = require("./Error/NoRootTypeError");
var NodeParser_1 = require("./NodeParser");
var DefinitionType_1 = require("./Type/DefinitionType");
var SchemaGenerator = (function () {
    function SchemaGenerator(program, nodeParser, typeFormatter) {
        this.program = program;
        this.nodeParser = nodeParser;
        this.typeFormatter = typeFormatter;
    }
    SchemaGenerator.prototype.createSchema = function (fullName) {
        var rootNode = this.findRootNode(fullName);
        var rootType = this.nodeParser.createType(rootNode, new NodeParser_1.Context());
        return __assign({ $schema: "http://json-schema.org/draft-04/schema#", definitions: this.getRootChildDefinitions(rootType) }, this.getRootTypeDefinition(rootType));
    };
    SchemaGenerator.prototype.findRootNode = function (fullName) {
        var _this = this;
        var typeChecker = this.program.getTypeChecker();
        var allTypes = new Map();
        this.program.getSourceFiles().forEach(function (sourceFile) {
            _this.inspectNode(sourceFile, typeChecker, allTypes);
        });
        if (!allTypes.has(fullName)) {
            throw new NoRootTypeError_1.NoRootTypeError(fullName);
        }
        return allTypes.get(fullName);
    };
    SchemaGenerator.prototype.inspectNode = function (node, typeChecker, allTypes) {
        var _this = this;
        if (node.kind === ts.SyntaxKind.InterfaceDeclaration ||
            node.kind === ts.SyntaxKind.EnumDeclaration ||
            node.kind === ts.SyntaxKind.TypeAliasDeclaration) {
            if (!this.isExportType(node)) {
                return;
            }
            else if (this.isGenericType(node)) {
                return;
            }
            allTypes.set(this.getFullName(node, typeChecker), node);
        }
        else {
            ts.forEachChild(node, function (subnode) { return _this.inspectNode(subnode, typeChecker, allTypes); });
        }
    };
    SchemaGenerator.prototype.isExportType = function (node) {
        var localSymbol = node.localSymbol;
        return localSymbol ? (localSymbol.flags & ts.SymbolFlags.Export) !== 0 : false;
    };
    SchemaGenerator.prototype.isGenericType = function (node) {
        return !!(node.typeParameters &&
            node.typeParameters.length > 0);
    };
    SchemaGenerator.prototype.getFullName = function (node, typeChecker) {
        var symbol = node.symbol;
        return typeChecker.getFullyQualifiedName(symbol).replace(/".*"\./, "");
    };
    SchemaGenerator.prototype.getRootTypeDefinition = function (rootType) {
        return this.typeFormatter.getDefinition(rootType);
    };
    SchemaGenerator.prototype.getRootChildDefinitions = function (rootType) {
        var _this = this;
        return this.typeFormatter.getChildren(rootType)
            .filter(function (child) { return child instanceof DefinitionType_1.DefinitionType; })
            .reduce(function (result, child) {
            return (__assign({}, result, (_a = {}, _a[child.getId()] = _this.typeFormatter.getDefinition(child.getType()), _a)));
            var _a;
        }, {});
    };
    return SchemaGenerator;
}());
exports.SchemaGenerator = SchemaGenerator;
//# sourceMappingURL=SchemaGenerator.js.map