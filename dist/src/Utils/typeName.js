"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeName = typeName;
const Errors_js_1 = require("../Error/Errors.js");
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
    if (type === "object") {
        return "object";
    }
    throw new Errors_js_1.ExpectationFailedError(`JavaScript type "typeof " can't be converted to JSON type name`);
}
//# sourceMappingURL=typeName.js.map