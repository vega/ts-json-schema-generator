"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainNodeParser = void 0;
const UnknownNodeError_1 = require("./Error/UnknownNodeError");
const ReferenceType_1 = require("./Type/ReferenceType");
class ChainNodeParser {
    constructor(typeChecker, nodeParsers) {
        this.typeChecker = typeChecker;
        this.nodeParsers = nodeParsers;
        this.typeCaches = new WeakMap();
    }
    addNodeParser(nodeParser) {
        this.nodeParsers.push(nodeParser);
        return this;
    }
    supportsNode(node) {
        return this.nodeParsers.some((nodeParser) => nodeParser.supportsNode(node));
    }
    createType(node, context, reference) {
        let typeCache = this.typeCaches.get(node);
        if (typeCache == null) {
            typeCache = new Map();
            this.typeCaches.set(node, typeCache);
        }
        const contextCacheKey = context.getCacheKey();
        let type = typeCache.get(contextCacheKey);
        if (!type) {
            type = this.getNodeParser(node, context).createType(node, context, reference);
            if (!(type instanceof ReferenceType_1.ReferenceType)) {
                typeCache.set(contextCacheKey, type);
            }
        }
        return type;
    }
    getNodeParser(node, context) {
        for (const nodeParser of this.nodeParsers) {
            if (nodeParser.supportsNode(node)) {
                return nodeParser;
            }
        }
        throw new UnknownNodeError_1.UnknownNodeError(node, context.getReference());
    }
}
exports.ChainNodeParser = ChainNodeParser;
//# sourceMappingURL=ChainNodeParser.js.map