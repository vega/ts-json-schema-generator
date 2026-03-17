"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOperatorNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const ArrayType_js_1 = require("../Type/ArrayType.js");
const BaseType_js_1 = require("../Type/BaseType.js");
const NumberType_js_1 = require("../Type/NumberType.js");
const ObjectType_js_1 = require("../Type/ObjectType.js");
const StringType_js_1 = require("../Type/StringType.js");
const UnionType_js_1 = require("../Type/UnionType.js");
const derefType_js_1 = require("../Utils/derefType.js");
const typeKeys_js_1 = require("../Utils/typeKeys.js");
class TypeOperatorNodeParser {
    childNodeParser;
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.TypeOperator;
    }
    createType(node, context) {
        const type = this.childNodeParser.createType(node.type, context);
        const derefed = (0, derefType_js_1.derefType)(type);
        // Remove readonly modifier from type
        if (node.operator === typescript_1.default.SyntaxKind.ReadonlyKeyword && derefed) {
            return derefed;
        }
        if (derefed instanceof ArrayType_js_1.ArrayType) {
            return new NumberType_js_1.NumberType();
        }
        const keys = (0, typeKeys_js_1.getTypeKeys)(type);
        if (derefed instanceof ObjectType_js_1.ObjectType && derefed.getAdditionalProperties() instanceof BaseType_js_1.BaseType) {
            return new UnionType_js_1.UnionType([...keys, new StringType_js_1.StringType()]);
        }
        if (keys.length === 1) {
            return keys[0];
        }
        return new UnionType_js_1.UnionType(keys);
    }
}
exports.TypeOperatorNodeParser = TypeOperatorNodeParser;
//# sourceMappingURL=TypeOperatorNodeParser.js.map