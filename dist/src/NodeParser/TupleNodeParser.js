"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const TupleType_1 = require("../Type/TupleType");
const isHidden_1 = require("../Utils/isHidden");
class TupleNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.TupleType;
    }
    createType(node, context) {
        const hidden = isHidden_1.referenceHidden(this.typeChecker);
        return new TupleType_1.TupleType(node.elementTypes
            .filter((subnode) => !hidden(subnode))
            .map((item) => {
            return this.childNodeParser.createType(item, context);
        }));
    }
}
exports.TupleNodeParser = TupleNodeParser;
//# sourceMappingURL=TupleNodeParser.js.map