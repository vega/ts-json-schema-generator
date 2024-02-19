"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionWithTypeArgumentsNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const NodeParser_1 = require("../NodeParser");
class ExpressionWithTypeArgumentsNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.ExpressionWithTypeArguments;
    }
    createType(node, context) {
        const typeSymbol = this.typeChecker.getSymbolAtLocation(node.expression);
        if (typeSymbol.flags & typescript_1.default.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            return this.childNodeParser.createType(aliasedSymbol.declarations[0], this.createSubContext(node, context));
        }
        else if (typeSymbol.flags & typescript_1.default.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        }
        else {
            return this.childNodeParser.createType(typeSymbol.declarations[0], this.createSubContext(node, context));
        }
    }
    createSubContext(node, parentContext) {
        var _a;
        const subContext = new NodeParser_1.Context(node);
        if ((_a = node.typeArguments) === null || _a === void 0 ? void 0 : _a.length) {
            node.typeArguments.forEach((typeArg) => {
                const type = this.childNodeParser.createType(typeArg, parentContext);
                subContext.pushArgument(type);
            });
        }
        return subContext;
    }
}
exports.ExpressionWithTypeArgumentsNodeParser = ExpressionWithTypeArgumentsNodeParser;
//# sourceMappingURL=ExpressionWithTypeArgumentsNodeParser.js.map