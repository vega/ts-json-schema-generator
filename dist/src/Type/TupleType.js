"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseType_1 = require("./BaseType");
class TupleType extends BaseType_1.BaseType {
    constructor(types) {
        super();
        this.types = types;
    }
    getId() {
        return "[" + this.types.map((item) => item.getId()).join(",") + "]";
    }
    getTypes() {
        return this.types;
    }
}
exports.TupleType = TupleType;
//# sourceMappingURL=TupleType.js.map