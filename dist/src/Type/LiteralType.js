"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseType_1 = require("./BaseType");
class LiteralType extends BaseType_1.BaseType {
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
}
exports.LiteralType = LiteralType;
//# sourceMappingURL=LiteralType.js.map