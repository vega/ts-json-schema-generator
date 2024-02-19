"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyAccessExpressionParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
class PropertyAccessExpressionParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.PropertyAccessExpression;
    }
    createType(node, context) {
        const type = this.typeChecker.getTypeAtLocation(node);
        return this.childNodeParser.createType(type.symbol.declarations[0], context);
    }
}
exports.PropertyAccessExpressionParser = PropertyAccessExpressionParser;
//# sourceMappingURL=PropertyAccessExpressionParser.js.map