"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularReferenceNodeParser = void 0;
const ReferenceType_1 = require("./Type/ReferenceType");
const nodeKey_1 = require("./Utils/nodeKey");
class CircularReferenceNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
        this.circular = new Map();
    }
    supportsNode(node) {
        return this.childNodeParser.supportsNode(node);
    }
    createType(node, context) {
        const key = (0, nodeKey_1.getKey)(node, context);
        if (this.circular.has(key)) {
            return this.circular.get(key);
        }
        const reference = new ReferenceType_1.ReferenceType();
        this.circular.set(key, reference);
        const type = this.childNodeParser.createType(node, context, reference);
        if (type) {
            reference.setType(type);
        }
        this.circular.delete(key);
        return type;
    }
}
exports.CircularReferenceNodeParser = CircularReferenceNodeParser;
//# sourceMappingURL=CircularReferenceNodeParser.js.map