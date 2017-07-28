"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseType_1 = require("./BaseType");
class IntersectionType extends BaseType_1.BaseType {
    constructor(types) {
        super();
        this.types = types;
    }
    getId() {
        return "(" + this.types.map((type) => type.getId()).join("&") + ")";
    }
    getTypes() {
        return this.types;
    }
}
exports.IntersectionType = IntersectionType;
//# sourceMappingURL=IntersectionType.js.map