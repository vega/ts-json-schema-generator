"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const UnionType_1 = require("../Type/UnionType");
const isHidden_1 = require("../Utils/isHidden");
class UnionNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.UnionType;
    }
    createType(node, context) {
        const hidden = isHidden_1.referenceHidden(this.typeChecker);
        return new UnionType_1.UnionType(node.types
            .filter((subnode) => !hidden(subnode))
            .map((subnode) => {
            return this.childNodeParser.createType(subnode, context);
        }));
    }
}
exports.UnionNodeParser = UnionNodeParser;
//# sourceMappingURL=UnionNodeParser.js.map