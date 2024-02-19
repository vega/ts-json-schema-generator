"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumType = void 0;
const BaseType_1 = require("./BaseType");
const LiteralType_1 = require("./LiteralType");
const NullType_1 = require("./NullType");
class EnumType extends BaseType_1.BaseType {
    constructor(id, values) {
        super();
        this.id = id;
        this.values = values;
        this.types = values.map((value) => (value == null ? new NullType_1.NullType() : new LiteralType_1.LiteralType(value)));
    }
    getId() {
        return this.id;
    }
    getValues() {
        return this.values;
    }
    getTypes() {
        return this.types;
    }
}
exports.EnumType = EnumType;
//# sourceMappingURL=EnumType.js.map