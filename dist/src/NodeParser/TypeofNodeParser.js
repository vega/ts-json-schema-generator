"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
class TypeofNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.TypeQuery;
    }
    createType(node, context) {
        const symbol = this.typeChecker.getSymbolAtLocation(node.exprName);
        return this.childNodeParser.createType(symbol.valueDeclaration.type, context);
    }
}
exports.TypeofNodeParser = TypeofNodeParser;
//# sourceMappingURL=TypeofNodeParser.js.map