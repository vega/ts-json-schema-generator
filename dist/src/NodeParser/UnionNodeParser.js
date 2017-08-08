"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const UnionType_1 = require("../Type/UnionType");
class UnionNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.UnionType;
    }
    createType(node, context) {
        return new UnionType_1.UnionType(node.types.map((subnode) => {
            return this.childNodeParser.createType(subnode, context);
        }));
    }
}
exports.UnionNodeParser = UnionNodeParser;
//# sourceMappingURL=UnionNodeParser.js.map