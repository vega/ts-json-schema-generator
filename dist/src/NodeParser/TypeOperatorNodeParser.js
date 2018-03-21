"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const EnumType_1 = require("../Type/EnumType");
class TypeOperatorNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.TypeOperator;
    }
    createType(node, context) {
        const type = this.typeChecker.getTypeFromTypeNode(node);
        return new EnumType_1.EnumType(`keyof-type-${node.getFullStart()}`, type.types.map((t) => t.value));
    }
}
exports.TypeOperatorNodeParser = TypeOperatorNodeParser;
//# sourceMappingURL=TypeOperatorNodeParser.js.map