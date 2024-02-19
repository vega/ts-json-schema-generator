"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeReferenceNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const NodeParser_1 = require("../NodeParser");
const AnnotatedType_1 = require("../Type/AnnotatedType");
const AnyType_1 = require("../Type/AnyType");
const ArrayType_1 = require("../Type/ArrayType");
const StringType_1 = require("../Type/StringType");
const invalidTypes = {
    [typescript_1.default.SyntaxKind.ModuleDeclaration]: true,
    [typescript_1.default.SyntaxKind.VariableDeclaration]: true,
};
class TypeReferenceNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.TypeReference;
    }
    createType(node, context) {
        var _a, _b;
        const typeSymbol = (_a = this.typeChecker.getSymbolAtLocation(node.typeName)) !== null && _a !== void 0 ? _a : node.typeName.symbol;
        if (typeSymbol.name === "Promise") {
            return this.childNodeParser.createType(node.typeArguments[0], this.createSubContext(node, context));
        }
        if (typeSymbol.flags & typescript_1.default.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            const declaration = (_b = aliasedSymbol.declarations) === null || _b === void 0 ? void 0 : _b.filter((n) => !invalidTypes[n.kind])[0];
            if (!declaration) {
                return new AnyType_1.AnyType();
            }
            return this.childNodeParser.createType(declaration, this.createSubContext(node, context));
        }
        if (typeSymbol.flags & typescript_1.default.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        }
        if (typeSymbol.name === "Array" || typeSymbol.name === "ReadonlyArray") {
            const type = this.createSubContext(node, context).getArguments()[0];
            return type === undefined ? new AnyType_1.AnyType() : new ArrayType_1.ArrayType(type);
        }
        if (typeSymbol.name === "Date") {
            return new AnnotatedType_1.AnnotatedType(new StringType_1.StringType(), { format: "date-time" }, false);
        }
        if (typeSymbol.name === "RegExp") {
            return new AnnotatedType_1.AnnotatedType(new StringType_1.StringType(), { format: "regex" }, false);
        }
        if (typeSymbol.name === "URL") {
            return new AnnotatedType_1.AnnotatedType(new StringType_1.StringType(), { format: "uri" }, false);
        }
        return this.childNodeParser.createType(typeSymbol.declarations.filter((n) => !invalidTypes[n.kind])[0], this.createSubContext(node, context));
    }
    createSubContext(node, parentContext) {
        var _a;
        const subContext = new NodeParser_1.Context(node);
        if ((_a = node.typeArguments) === null || _a === void 0 ? void 0 : _a.length) {
            for (const typeArg of node.typeArguments) {
                subContext.pushArgument(this.childNodeParser.createType(typeArg, parentContext));
            }
        }
        return subContext;
    }
}
exports.TypeReferenceNodeParser = TypeReferenceNodeParser;
//# sourceMappingURL=TypeReferenceNodeParser.js.map