"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const ObjectType_1 = require("../Type/ObjectType");
class ObjectTypeNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.ObjectKeyword;
    }
    createType(node, context) {
        return new ObjectType_1.ObjectType(`object-${node.getFullStart()}`, [], [], true);
    }
}
exports.ObjectTypeNodeParser = ObjectTypeNodeParser;
//# sourceMappingURL=ObjectTypeNodeParser.js.map