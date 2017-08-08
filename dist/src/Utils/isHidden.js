"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isHidden(symbol) {
    const jsDocTags = symbol.getJsDocTags();
    if (!jsDocTags || !jsDocTags.length) {
        return false;
    }
    const jsDocTag = jsDocTags.find((tag) => tag.name === "hide");
    return !!jsDocTag;
}
exports.isHidden = isHidden;
//# sourceMappingURL=isHidden.js.map