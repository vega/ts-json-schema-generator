"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const TupleType_js_1 = require("../Type/TupleType.js");
class TupleNodeParser {
    typeChecker;
    childNodeParser;
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.TupleType;
    }
    createType(node, context) {
        return new TupleType_js_1.TupleType(node.elements.map((item) => {
            return this.childNodeParser.createType(item, context);
        }));
    }
}
exports.TupleNodeParser = TupleNodeParser;
//# sourceMappingURL=TupleNodeParser.js.map