"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InferTypeNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const InferType_js_1 = require("../Type/InferType.js");
class InferTypeNodeParser {
    typeChecker;
    childNodeParser;
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.InferType;
    }
    createType(node, _context) {
        return new InferType_js_1.InferType(node.typeParameter.name.escapedText.toString());
    }
}
exports.InferTypeNodeParser = InferTypeNodeParser;
//# sourceMappingURL=InferTypeNodeParser.js.map