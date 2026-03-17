"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNodeHidden = isNodeHidden;
const hasJsDocTag_js_1 = require("./hasJsDocTag.js");
function isNodeHidden(node) {
    return (0, hasJsDocTag_js_1.hasJsDocTag)(node, "hidden");
}
//# sourceMappingURL=isHidden.js.map