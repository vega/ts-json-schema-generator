"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalType = void 0;
const BaseType_js_1 = require("./BaseType.js");
class OptionalType extends BaseType_js_1.BaseType {
    item;
    constructor(item) {
        super();
        this.item = item;
    }
    getId() {
        return `${this.item.getId()}?`;
    }
    getType() {
        return this.item;
    }
}
exports.OptionalType = OptionalType;
//# sourceMappingURL=OptionalType.js.map