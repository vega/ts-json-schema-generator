"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const NodeParser_1 = require("../NodeParser");
const ArrayType_1 = require("../Type/ArrayType");
const invlidTypes = {
    [ts.SyntaxKind.ModuleDeclaration]: true,
    [ts.SyntaxKind.VariableDeclaration]: true,
};
class TypeReferenceNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.TypeReference;
    }
    createType(node, context) {
        const typeSymbol = this.typeChecker.getSymbolAtLocation(node.typeName);
        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            return this.childNodeParser.createType(aliasedSymbol.declarations.filter((n) => !invlidTypes[n.kind])[0], this.createSubContext(node, context));
        }
        else if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        }
        else if (typeSymbol.name === "Array" || typeSymbol.name === "ReadonlyArray") {
            return new ArrayType_1.ArrayType(this.createSubContext(node, context).getArguments()[0]);
        }
        else {
            return this.childNodeParser.createType(typeSymbol.declarations.filter((n) => !invlidTypes[n.kind])[0], this.createSubContext(node, context));
        }
    }
    createSubContext(node, parentContext) {
        const subContext = new NodeParser_1.Context(node);
        if (node.typeArguments && node.typeArguments.length) {
            node.typeArguments.forEach((typeArg) => {
                subContext.pushArgument(this.childNodeParser.createType(typeArg, parentContext));
            });
        }
        return subContext;
    }
}
exports.TypeReferenceNodeParser = TypeReferenceNodeParser;
//# sourceMappingURL=TypeReferenceNodeParser.js.map