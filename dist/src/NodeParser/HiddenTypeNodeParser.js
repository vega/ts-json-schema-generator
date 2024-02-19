"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HiddenNodeParser = void 0;
const HiddenType_1 = require("../Type/HiddenType");
const isHidden_1 = require("../Utils/isHidden");
class HiddenNodeParser {
    constructor(typeChecker) {
        this.typeChecker = typeChecker;
    }
    supportsNode(node) {
        return (0, isHidden_1.isNodeHidden)(node);
    }
    createType(_node, _context) {
        return new HiddenType_1.HiddenType();
    }
}
exports.HiddenNodeParser = HiddenNodeParser;
//# sourceMappingURL=HiddenTypeNodeParser.js.map