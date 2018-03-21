"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const IntersectionType_1 = require("../Type/IntersectionType");
const isHidden_1 = require("../Utils/isHidden");
class IntersectionNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.IntersectionType;
    }
    createType(node, context) {
        const hidden = isHidden_1.referenceHidden(this.typeChecker);
        return new IntersectionType_1.IntersectionType(node.types
            .filter((subnode) => !hidden(subnode))
            .map((subnode) => {
            return this.childNodeParser.createType(subnode, context);
        }));
    }
}
exports.IntersectionNodeParser = IntersectionNodeParser;
//# sourceMappingURL=IntersectionNodeParser.js.map