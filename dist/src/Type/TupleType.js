"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleType = void 0;
const derefType_1 = require("../Utils/derefType");
const BaseType_1 = require("./BaseType");
const RestType_1 = require("./RestType");
function normalize(types) {
    let normalized = [];
    for (const type of types) {
        if (type instanceof RestType_1.RestType) {
            const inner_type = (0, derefType_1.derefType)(type.getType());
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
class TupleType extends BaseType_1.BaseType {
    constructor(types) {
        super();
        this.types = normalize(types);
    }
    getId() {
        return `[${this.types.map((item) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.getId()) !== null && _a !== void 0 ? _a : "never"; }).join(",")}]`;
    }
    getTypes() {
        return this.types;
    }
}
exports.TupleType = TupleType;
//# sourceMappingURL=TupleType.js.map