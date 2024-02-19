"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeAliasNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const AliasType_1 = require("../Type/AliasType");
const NeverType_1 = require("../Type/NeverType");
const nodeKey_1 = require("../Utils/nodeKey");
class TypeAliasNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.TypeAliasDeclaration;
    }
    createType(node, context, reference) {
        var _a;
        if ((_a = node.typeParameters) === null || _a === void 0 ? void 0 : _a.length) {
            for (const typeParam of node.typeParameters) {
                const nameSymbol = this.typeChecker.getSymbolAtLocation(typeParam.name);
                context.pushParameter(nameSymbol.name);
                if (typeParam.default) {
                    const type = this.childNodeParser.createType(typeParam.default, context);
                    context.setDefault(nameSymbol.name, type);
                }
            }
        }
        const id = this.getTypeId(node, context);
        const name = this.getTypeName(node, context);
        if (reference) {
            reference.setId(id);
            reference.setName(name);
        }
        const type = this.childNodeParser.createType(node.type, context);
        if (type instanceof NeverType_1.NeverType) {
            return new NeverType_1.NeverType();
        }
        return new AliasType_1.AliasType(id, type);
    }
    getTypeId(node, context) {
        return `alias-${(0, nodeKey_1.getKey)(node, context)}`;
    }
    getTypeName(node, context) {
        const argumentIds = context.getArguments().map((arg) => arg === null || arg === void 0 ? void 0 : arg.getName());
        const fullName = node.name.getText();
        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
exports.TypeAliasNodeParser = TypeAliasNodeParser;
//# sourceMappingURL=TypeAliasNodeParser.js.map