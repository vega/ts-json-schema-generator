"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const EnumType_1 = require("../Type/EnumType");
const __1 = require("../..");
const __2 = require("../..");
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
        if (node.type && context.getArguments.length) {
            let p = context.getParameterProperties(node.type.typeName.text);
            return new __1.UnionType(p.map((op) => {
                return new __2.LiteralType(op.name);
            }));
        }
        else {
            return new EnumType_1.EnumType(`keyof-type-${node.getFullStart()}`, type.types.map((t) => t.value));
        }
    }
}
exports.TypeOperatorNodeParser = TypeOperatorNodeParser;
//# sourceMappingURL=TypeOperatorNodeParser.js.map