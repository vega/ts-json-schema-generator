"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasJsDocTag = void 0;
const symbolAtNode_1 = require("./symbolAtNode");
function hasJsDocTag(node, tagName) {
    var _a;
    const symbol = (0, symbolAtNode_1.symbolAtNode)(node);
    return symbol ? (_a = symbol.getJsDocTags()) === null || _a === void 0 ? void 0 : _a.some((tag) => tag.name === tagName) : false;
}
exports.hasJsDocTag = hasJsDocTag;
//# sourceMappingURL=hasJsDocTag.js.map