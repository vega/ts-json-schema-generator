"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HiddenNodeParser = void 0;
const HiddenType_js_1 = require("../Type/HiddenType.js");
const isHidden_js_1 = require("../Utils/isHidden.js");
class HiddenNodeParser {
    typeChecker;
    constructor(typeChecker) {
        this.typeChecker = typeChecker;
    }
    supportsNode(node) {
        return (0, isHidden_js_1.isNodeHidden)(node);
    }
    createType(_node, _context) {
        return new HiddenType_js_1.HiddenType();
    }
}
exports.HiddenNodeParser = HiddenNodeParser;
//# sourceMappingURL=HiddenTypeNodeParser.js.map