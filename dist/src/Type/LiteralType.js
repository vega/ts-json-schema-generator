"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteralType = void 0;
const BaseType_js_1 = require("./BaseType.js");
class LiteralType extends BaseType_js_1.BaseType {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    getId() {
        return JSON.stringify(this.value);
    }
    getValue() {
        return this.value;
    }
    isString() {
        return typeof this.value === "string";
    }
}
exports.LiteralType = LiteralType;
//# sourceMappingURL=LiteralType.js.map