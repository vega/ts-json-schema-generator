"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UnknownNodeError_1 = require("./Error/UnknownNodeError");
class ChainNodeParser {
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
    createType(node, context) {
        return this.getNodeParser(node, context).createType(node, context);
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