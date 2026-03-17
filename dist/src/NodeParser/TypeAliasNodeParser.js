"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeAliasNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const AliasType_js_1 = require("../Type/AliasType.js");
const NeverType_js_1 = require("../Type/NeverType.js");
const nodeKey_js_1 = require("../Utils/nodeKey.js");
class TypeAliasNodeParser {
    typeChecker;
    childNodeParser;
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.TypeAliasDeclaration;
    }
    createType(node, context, reference) {
        if (node.typeParameters?.length) {
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
        if (type instanceof NeverType_js_1.NeverType) {
            return new NeverType_js_1.NeverType();
        }
        return new AliasType_js_1.AliasType(id, type);
    }
    getTypeId(node, context) {
        return `alias-${(0, nodeKey_js_1.getKey)(node, context)}`;
    }
    getTypeName(node, context) {
        const argumentIds = context.getArguments().map((arg) => arg?.getName());
        const fullName = node.name.getText();
        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
exports.TypeAliasNodeParser = TypeAliasNodeParser;
//# sourceMappingURL=TypeAliasNodeParser.js.map