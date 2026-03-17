"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExtendsType = isExtendsType;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
function isExtendsType(node) {
    if (!node) {
        return false;
    }
    let current = node;
    while (current.parent) {
        if (typescript_1.default.isConditionalTypeNode(current.parent)) {
            const conditionalNode = current.parent;
            if (conditionalNode.extendsType === current) {
                return true;
            }
        }
        current = current.parent;
    }
    return false;
}
//# sourceMappingURL=isExtendsType.js.map