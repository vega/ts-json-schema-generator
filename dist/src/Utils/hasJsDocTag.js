"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasJsDocTag = hasJsDocTag;
const symbolAtNode_js_1 = require("./symbolAtNode.js");
function hasJsDocTag(node, tagName) {
    const symbol = (0, symbolAtNode_js_1.symbolAtNode)(node);
    return symbol ? symbol.getJsDocTags()?.some((tag) => tag.name === tagName) : false;
}
//# sourceMappingURL=hasJsDocTag.js.map