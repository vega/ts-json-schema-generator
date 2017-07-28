"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const StringType_1 = require("../Type/StringType");
class StringTypeNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.StringKeyword;
    }
    createType(node, context) {
        return new StringType_1.StringType();
    }
}
exports.StringTypeNodeParser = StringTypeNodeParser;
//# sourceMappingURL=StringTypeNodeParser.js.map