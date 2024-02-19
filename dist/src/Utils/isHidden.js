"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNodeHidden = void 0;
const hasJsDocTag_1 = require("./hasJsDocTag");
function isNodeHidden(node) {
    return (0, hasJsDocTag_1.hasJsDocTag)(node, "hidden");
}
exports.isNodeHidden = isNodeHidden;
//# sourceMappingURL=isHidden.js.map