"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const AliasType_1 = require("../Type/AliasType");
class TypeAliasNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.TypeAliasDeclaration;
    }
    createType(node, context) {
        if (node.typeParameters && node.typeParameters.length) {
            node.typeParameters.forEach((typeParam) => {
                const nameSymbol = this.typeChecker.getSymbolAtLocation(typeParam.name);
                context.pushParameter(nameSymbol.name);
            });
        }
        return new AliasType_1.AliasType(this.getTypeId(node, context), this.childNodeParser.createType(node.type, context));
    }
    getTypeId(node, context) {
        const fullName = `alias-${node.getFullStart()}`;
        const argumentIds = context.getArguments().map((arg) => arg.getId());
        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
exports.TypeAliasNodeParser = TypeAliasNodeParser;
//# sourceMappingURL=TypeAliasNodeParser.js.map