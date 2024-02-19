"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayType = void 0;
const BaseType_1 = require("./BaseType");
class ArrayType extends BaseType_1.BaseType {
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