"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallExpressionParser = void 0;
const TupleType_1 = require("../Type/TupleType");
const typescript_1 = __importDefault(require("typescript"));
const NodeParser_1 = require("../NodeParser");
const UnionType_1 = require("../Type/UnionType");
const LiteralType_1 = require("../Type/LiteralType");
const SymbolType_1 = require("../Type/SymbolType");
class CallExpressionParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.CallExpression;
    }
    createType(node, context) {
        const type = this.typeChecker.getTypeAtLocation(node);
        if (type === null || type === void 0 ? void 0 : type.typeArguments) {
            return new TupleType_1.TupleType([
                new UnionType_1.UnionType(type.typeArguments[0].types.map((t) => new LiteralType_1.LiteralType(t.value))),
            ]);
        }
        if (type.flags === typescript_1.default.TypeFlags.UniqueESSymbol) {
            return new SymbolType_1.SymbolType();
        }
        const symbol = type.symbol || type.aliasSymbol;
        const decl = symbol.valueDeclaration || symbol.declarations[0];
        const subContext = this.createSubContext(node, context);
        return this.childNodeParser.createType(decl, subContext);
    }
    createSubContext(node, parentContext) {
        const subContext = new NodeParser_1.Context(node);
        for (const arg of node.arguments) {
            const type = this.childNodeParser.createType(arg, parentContext);
            subContext.pushArgument(type);
        }
        return subContext;
    }
}
exports.CallExpressionParser = CallExpressionParser;
//# sourceMappingURL=CallExpressionParser.js.map