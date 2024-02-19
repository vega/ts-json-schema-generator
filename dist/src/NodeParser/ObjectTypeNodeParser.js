"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectTypeNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ObjectType_1 = require("../Type/ObjectType");
const nodeKey_1 = require("../Utils/nodeKey");
class ObjectTypeNodeParser {
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.ObjectKeyword;
    }
    createType(node, context) {
        return new ObjectType_1.ObjectType(`object-${(0, nodeKey_1.getKey)(node, context)}`, [], [], true, true);
    }
}
exports.ObjectTypeNodeParser = ObjectTypeNodeParser;
//# sourceMappingURL=ObjectTypeNodeParser.js.map