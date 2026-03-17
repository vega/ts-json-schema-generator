"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntersectionType = void 0;
const BaseType_js_1 = require("./BaseType.js");
class IntersectionType extends BaseType_js_1.BaseType {
    types;
    constructor(types) {
        super();
        this.types = types;
    }
    getId() {
        return `(${this.types.map((type) => type.getId()).join("&")})`;
    }
    getTypes() {
        return this.types;
    }
}
exports.IntersectionType = IntersectionType;
//# sourceMappingURL=IntersectionType.js.map