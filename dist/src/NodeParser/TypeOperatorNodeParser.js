"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOperatorNodeParser = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ArrayType_1 = require("../Type/ArrayType");
const NumberType_1 = require("../Type/NumberType");
const ObjectType_1 = require("../Type/ObjectType");
const StringType_1 = require("../Type/StringType");
const UnionType_1 = require("../Type/UnionType");
const derefType_1 = require("../Utils/derefType");
const typeKeys_1 = require("../Utils/typeKeys");
class TypeOperatorNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.TypeOperator;
    }
    createType(node, context) {
        const type = this.childNodeParser.createType(node.type, context);
        const derefed = (0, derefType_1.derefType)(type);
        if (node.operator === typescript_1.default.SyntaxKind.ReadonlyKeyword && derefed) {
            return derefed;
        }
        if (derefed instanceof ArrayType_1.ArrayType) {
            return new NumberType_1.NumberType();
        }
        const keys = (0, typeKeys_1.getTypeKeys)(type);
        if (derefed instanceof ObjectType_1.ObjectType && derefed.getAdditionalProperties()) {
            return new UnionType_1.UnionType([...keys, new StringType_1.StringType()]);
        }
        if (keys.length === 1) {
            return keys[0];
        }
        return new UnionType_1.UnionType(keys);
    }
}
exports.TypeOperatorNodeParser = TypeOperatorNodeParser;
//# sourceMappingURL=TypeOperatorNodeParser.js.map