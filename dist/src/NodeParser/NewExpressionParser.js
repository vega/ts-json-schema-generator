"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewExpressionParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const NodeParser_js_1 = require("../NodeParser.js");
const Errors_js_1 = require("../Error/Errors.js");
class NewExpressionParser {
    typeChecker;
    childNodeParser;
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.NewExpression;
    }
    createType(node, context) {
        const type = this.typeChecker.getTypeAtLocation(node);
        const symbol = type.symbol || type.aliasSymbol;
        const decl = this.typeChecker.typeToTypeNode(type, node, typescript_1.default.NodeBuilderFlags.IgnoreErrors) ||
            symbol?.valueDeclaration ||
            symbol?.declarations?.[0];
        if (!decl) {
            throw new Errors_js_1.UnknownNodeError(node);
        }
        return this.childNodeParser.createType(decl, this.createSubContext(node, context));
    }
    createSubContext(node, parentContext) {
        const subContext = new NodeParser_js_1.Context(node);
        if (node.arguments) {
            for (const arg of node.arguments) {
                const type = this.childNodeParser.createType(arg, parentContext);
                subContext.pushArgument(type);
            }
        }
        return subContext;
    }
}
exports.NewExpressionParser = NewExpressionParser;
//# sourceMappingURL=NewExpressionParser.js.map