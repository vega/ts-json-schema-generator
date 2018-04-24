"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const EnumType_1 = require("../Type/EnumType");
class IndexedAccessTypeNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.IndexedAccessType;
    }
    createType(node, context) {
        const symbol = this.typeChecker.getSymbolAtLocation(node.objectType.exprName);
        if (node.indexType && node.indexType.type && node.indexType.type.typeName &&
            node.indexType.type.typeName.text &&
            node.objectType && node.objectType.typeName &&
            node.objectType.typeName.text === node.indexType.type.typeName.text) {
            return this.childNodeParser.createType(context.getArguments()[0], context);
        }
        else {
            return new EnumType_1.EnumType(`indexed-type-${node.getFullStart()}`, symbol.valueDeclaration.type.elementTypes.map((memberType) => this.childNodeParser.createType(memberType, context)));
        }
    }
}
exports.IndexedAccessTypeNodeParser = IndexedAccessTypeNodeParser;
//# sourceMappingURL=IndexedAccessTypeNodeParser.js.map