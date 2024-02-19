"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestType = void 0;
const BaseType_1 = require("./BaseType");
class RestType extends BaseType_1.BaseType {
    constructor(item, title = null) {
        super();
        this.item = item;
        this.title = title;
    }
    getId() {
        return `...${this.item.getId()}${this.title || ""}`;
    }
    getTitle() {
        return this.title;
    }
    getType() {
        return this.item;
    }
}
exports.RestType = RestType;
//# sourceMappingURL=RestType.js.map