"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReferenceType_1 = require("./Type/ReferenceType");
class CircularReferenceNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
        this.circular = new Map();
    }
    supportsNode(node) {
        return this.childNodeParser.supportsNode(node);
    }
    createType(node, context) {
        const key = this.createCacheKey(node, context);
        if (this.circular.has(key)) {
            return this.circular.get(key);
        }
        const reference = new ReferenceType_1.ReferenceType();
        this.circular.set(key, reference);
        reference.setType(this.childNodeParser.createType(node, context));
        this.circular.delete(key);
        return reference.getType();
    }
    createCacheKey(node, context) {
        const ids = [];
        while (node) {
            ids.push(node.pos, node.end);
            node = node.parent;
        }
        return ids.join("-") + "<" + context.getArguments().map((arg) => arg.getId()).join(",") + ">";
    }
}
exports.CircularReferenceNodeParser = CircularReferenceNodeParser;
//# sourceMappingURL=CircularReferenceNodeParser.js.map