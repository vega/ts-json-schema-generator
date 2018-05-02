"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseType_1 = require("./BaseType");
class EnumType extends BaseType_1.BaseType {
    constructor(id, values) {
        super();
        this.id = id;
        this.values = values;
    }
    getId() {
        return this.id;
    }
    getValues() {
        return this.values;
    }
}
exports.EnumType = EnumType;
//# sourceMappingURL=EnumType.js.map