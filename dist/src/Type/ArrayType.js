"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayType = void 0;
const BaseType_js_1 = require("./BaseType.js");
class ArrayType extends BaseType_js_1.BaseType {
    item;
    constructor(item) {
        super();
        this.item = item;
    }
    getId() {
        return `${this.item.getId()}[]`;
    }
    getItem() {
        return this.item;
    }
}
exports.ArrayType = ArrayType;
//# sourceMappingURL=ArrayType.js.map