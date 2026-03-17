"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleType = void 0;
const derefType_js_1 = require("../Utils/derefType.js");
const BaseType_js_1 = require("./BaseType.js");
const RestType_js_1 = require("./RestType.js");
function normalize(types) {
    let normalized = [];
    for (const type of types) {
        if (type instanceof RestType_js_1.RestType) {
            const inner_type = (0, derefType_js_1.derefType)(type.getType());
            normalized = [
                ...normalized,
                ...(inner_type instanceof TupleType ? normalize(inner_type.getTypes()) : [type]),
            ];
        }
        else {
            normalized.push(type);
        }
    }
    return normalized;
}
class TupleType extends BaseType_js_1.BaseType {
    types;
    constructor(types) {
        super();
        this.types = normalize(types);
    }
    getId() {
        return `[${this.types.map((item) => item?.getId() ?? "never").join(",")}]`;
    }
    getTypes() {
        return this.types;
    }
}
exports.TupleType = TupleType;
//# sourceMappingURL=TupleType.js.map