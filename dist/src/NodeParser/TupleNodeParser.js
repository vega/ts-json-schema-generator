"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const TupleType_1 = require("../Type/TupleType");
class TupleNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.TupleType;
    }
    createType(node, context) {
        return new TupleType_1.TupleType(node.elementTypes.map((item) => {
            return this.childNodeParser.createType(item, context);
        }));
    }
}
exports.TupleNodeParser = TupleNodeParser;
//# sourceMappingURL=TupleNodeParser.js.map