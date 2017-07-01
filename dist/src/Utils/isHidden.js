"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isHidden(symbol) {
    var jsDocTags = symbol.getJsDocTags();
    if (!jsDocTags || !jsDocTags.length) {
        return false;
    }
    var jsDocTag = jsDocTags.find(function (tag) { return tag.name === "hide"; });
    return !!jsDocTag;
}
exports.isHidden = isHidden;
//# sourceMappingURL=isHidden.js.map