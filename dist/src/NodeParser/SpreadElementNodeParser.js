"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpreadElementNodeParser = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const RestType_js_1 = require("../Type/RestType.js");
/**
 * Handles `...expr` inside an ArrayLiteralExpression.
 * Turns it into RestType so TupleTypeFormatter can emit correct JSON-Schema.
 */
class SpreadElementNodeParser {
    childNodeParser;
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === typescript_1.default.SyntaxKind.SpreadElement;
    }
    createType(node, context) {
        const inner = this.childNodeParser.createType(node.expression, context);
        return new RestType_js_1.RestType(inner);
    }
}
exports.SpreadElementNodeParser = SpreadElementNodeParser;
//# sourceMappingURL=SpreadElementNodeParser.js.map