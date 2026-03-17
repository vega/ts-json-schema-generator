"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const ObjectType_js_1 = require("../Type/ObjectType.js");
const nodeKey_js_1 = require("../Utils/nodeKey.js");
class ObjectTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.ObjectKeyword;
    }
    createType(node, context) {
        return new ObjectType_js_1.ObjectType(`object-${(0, nodeKey_js_1.getKey)(node, context)}`, [], [], true, true);
    }
}
exports.ObjectTypeNodeParser = ObjectTypeNodeParser;
//# sourceMappingURL=ObjectTypeNodeParser.js.map