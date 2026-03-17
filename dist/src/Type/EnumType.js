"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumType = void 0;
const BaseType_js_1 = require("./BaseType.js");
const LiteralType_js_1 = require("./LiteralType.js");
const NullType_js_1 = require("./NullType.js");
class EnumType extends BaseType_js_1.BaseType {
    id;
    values;
    types;
    constructor(id, values) {
        super();
        this.id = id;
        this.values = values;
        this.types = values.map((value) => (value == null ? new NullType_js_1.NullType() : new LiteralType_js_1.LiteralType(value)));
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