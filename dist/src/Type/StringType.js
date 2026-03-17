"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringType = void 0;
const PrimitiveType_js_1 = require("./PrimitiveType.js");
class StringType extends PrimitiveType_js_1.PrimitiveType {
    preserveLiterals;
    constructor(preserveLiterals = false) {
        super();
        this.preserveLiterals = preserveLiterals;
    }
    getId() {
        return "string";
    }
    getPreserveLiterals() {
        return this.preserveLiterals;
    }
}
exports.StringType = StringType;
//# sourceMappingURL=StringType.js.map