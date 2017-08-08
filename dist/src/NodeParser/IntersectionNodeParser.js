"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const IntersectionType_1 = require("../Type/IntersectionType");
class IntersectionNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.IntersectionType;
    }
    createType(node, context) {
        return new IntersectionType_1.IntersectionType(node.types.map((subnode) => {
            return this.childNodeParser.createType(subnode, context);
        }));
    }
}
exports.IntersectionNodeParser = IntersectionNodeParser;
//# sourceMappingURL=IntersectionNodeParser.js.map