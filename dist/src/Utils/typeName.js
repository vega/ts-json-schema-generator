"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeName = void 0;
function typeName(value) {
    if (value === null) {
        return "null";
    }
    const type = typeof value;
    if (type === "string" || type === "number" || type === "boolean") {
        return type;
    }
    if (Array.isArray(value)) {
        return "array";
    }
    else if (type === "object") {
        return "object";
    }
    else {
        throw new Error(`JavaScript type "${type}" can't be converted to JSON type name`);
    }
}
exports.typeName = typeName;
//# sourceMappingURL=typeName.js.map