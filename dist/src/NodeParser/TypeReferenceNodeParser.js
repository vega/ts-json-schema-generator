"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeReferenceNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const NodeParser_js_1 = require("../NodeParser.js");
const AnnotatedType_js_1 = require("../Type/AnnotatedType.js");
const AnyType_js_1 = require("../Type/AnyType.js");
const ArrayType_js_1 = require("../Type/ArrayType.js");
const StringType_js_1 = require("../Type/StringType.js");
const UnknownType_js_1 = require("../Type/UnknownType.js");
const symbolAtNode_js_1 = require("../Utils/symbolAtNode.js");
const invalidTypes = {
    [typescript_1.default.SyntaxKind.ModuleDeclaration]: true,
    [typescript_1.default.SyntaxKind.VariableDeclaration]: true,
};
class TypeReferenceNodeParser {
    typeChecker;
    childNodeParser;
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.TypeReference;
    }
    createType(node, context) {
        const typeSymbol = this.typeChecker.getSymbolAtLocation(node.typeName) ??
            // When the node doesn't have a valid source file, its position is -1, so we can't
            // search for a symbol based on its location. In that case, the ts.factory defines a symbol
            // property on the node itself.
            (0, symbolAtNode_js_1.symbolAtNode)(node.typeName);
        if (typeSymbol.flags & typescript_1.default.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            const declaration = aliasedSymbol.declarations?.filter((n) => !invalidTypes[n.kind])[0];
            if (!declaration) {
                // fallback for bun.sh
                return new AnyType_js_1.AnyType();
            }
            return this.childNodeParser.createType(declaration, this.createSubContext(node, context));
        }
        if (typeSymbol.flags & typescript_1.default.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name) ?? new UnknownType_js_1.UnknownType(true);
        }
        // Wraps promise type to avoid resolving to a empty Object type.
        if (typeSymbol.name === "Promise" || typeSymbol.name === "PromiseLike") {
            // Promise without type resolves to Promise<any>
            if (!node.typeArguments || node.typeArguments.length === 0) {
                return new AnyType_js_1.AnyType();
            }
            return this.childNodeParser.createType(node.typeArguments[0], context);
        }
        if (typeSymbol.name === "Array" || typeSymbol.name === "ReadonlyArray") {
            const type = this.createSubContext(node, context).getArguments()[0];
            return type === undefined ? new AnyType_js_1.AnyType() : new ArrayType_js_1.ArrayType(type);
        }
        if (typeSymbol.name === "Date") {
            return new AnnotatedType_js_1.AnnotatedType(new StringType_js_1.StringType(), { format: "date-time" }, false);
        }
        if (typeSymbol.name === "RegExp") {
            return new AnnotatedType_js_1.AnnotatedType(new StringType_js_1.StringType(), { format: "regex" }, false);
        }
        if (typeSymbol.name === "URL") {
            return new AnnotatedType_js_1.AnnotatedType(new StringType_js_1.StringType(), { format: "uri" }, false);
        }
        return this.childNodeParser.createType(typeSymbol.declarations.filter((n) => !invalidTypes[n.kind])[0], this.createSubContext(node, context));
    }
    createSubContext(node, parentContext) {
        const subContext = new NodeParser_js_1.Context(node);
        if (node.typeArguments?.length) {
            for (const typeArg of node.typeArguments) {
                subContext.pushArgument(this.childNodeParser.createType(typeArg, parentContext));
            }
        }
        return subContext;
    }
}
exports.TypeReferenceNodeParser = TypeReferenceNodeParser;
//# sourceMappingURL=TypeReferenceNodeParser.js.map