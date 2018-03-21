"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const NoRootTypeError_1 = require("./Error/NoRootTypeError");
const NodeParser_1 = require("./NodeParser");
const DefinitionType_1 = require("./Type/DefinitionType");
class SchemaGenerator {
    constructor(program, nodeParser, typeFormatter) {
        this.program = program;
        this.nodeParser = nodeParser;
        this.typeFormatter = typeFormatter;
    }
    createSchema(fullName) {
        const rootNode = this.findRootNode(fullName);
        const rootType = this.nodeParser.createType(rootNode, new NodeParser_1.Context());
        return Object.assign({ $schema: "http://json-schema.org/draft-06/schema#", definitions: this.getRootChildDefinitions(rootType) }, this.getRootTypeDefinition(rootType));
    }
    findRootNode(fullName) {
        const typeChecker = this.program.getTypeChecker();
        const allTypes = new Map();
        this.program.getSourceFiles().forEach((sourceFile) => {
            this.inspectNode(sourceFile, typeChecker, allTypes);
        });
        if (!allTypes.has(fullName)) {
            throw new NoRootTypeError_1.NoRootTypeError(fullName);
        }
        return allTypes.get(fullName);
    }
    inspectNode(node, typeChecker, allTypes) {
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
            ts.forEachChild(node, (subnode) => this.inspectNode(subnode, typeChecker, allTypes));
        }
    }
    isExportType(node) {
        const localSymbol = node.localSymbol;
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }
    isGenericType(node) {
        return !!(node.typeParameters &&
            node.typeParameters.length > 0);
    }
    getFullName(node, typeChecker) {
        const symbol = node.symbol;
        return typeChecker.getFullyQualifiedName(symbol).replace(/".*"\./, "");
    }
    getRootTypeDefinition(rootType) {
        return this.typeFormatter.getDefinition(rootType);
    }
    getRootChildDefinitions(rootType) {
        return this.typeFormatter.getChildren(rootType)
            .filter((child) => child instanceof DefinitionType_1.DefinitionType)
            .reduce((result, child) => (Object.assign({}, result, { [child.getId()]: this.typeFormatter.getDefinition(child.getType()) })), {});
    }
}
exports.SchemaGenerator = SchemaGenerator;
//# sourceMappingURL=SchemaGenerator.js.map