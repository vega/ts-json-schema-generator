"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainNodeParser = void 0;
const Errors_js_1 = require("./Error/Errors.js");
const ReferenceType_js_1 = require("./Type/ReferenceType.js");
class ChainNodeParser {
    typeChecker;
    nodeParsers;
    typeCaches = new WeakMap();
    constructor(typeChecker, nodeParsers) {
        this.typeChecker = typeChecker;
        this.nodeParsers = nodeParsers;
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
            try {
                type = this.getNodeParser(node).createType(node, context, reference);
            }
            catch (error) {
                throw Errors_js_1.UnhandledError.from("Unhandled error while creating Base Type.", node, error);
            }
            if (!(type instanceof ReferenceType_js_1.ReferenceType)) {
                typeCache.set(contextCacheKey, type);
            }
        }
        if (!type) {
            throw new Errors_js_1.UnknownNodeError(node);
        }
        return type;
    }
    getNodeParser(node) {
        for (const nodeParser of this.nodeParsers) {
            if (nodeParser.supportsNode(node)) {
                return nodeParser;
            }
        }
        throw new Errors_js_1.UnknownNodeError(node);
    }
}
exports.ChainNodeParser = ChainNodeParser;
//# sourceMappingURL=ChainNodeParser.js.map