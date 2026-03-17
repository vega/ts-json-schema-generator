"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownType = void 0;
exports.isErroredUnknownType = isErroredUnknownType;
const BaseType_js_1 = require("./BaseType.js");
class UnknownType extends BaseType_js_1.BaseType {
    erroredSource;
    constructor(
    /**
     * If the source for this UnknownType was from a failed operation than to an actual `unknown` type present in the source code.
     */
    erroredSource = false) {
        super();
        this.erroredSource = erroredSource;
    }
    getId() {
        return "unknown";
    }
}
exports.UnknownType = UnknownType;
/**
 * Checks for an UnknownType with an errored source.
 */
function isErroredUnknownType(type) {
    return type instanceof UnknownType && type.erroredSource;
}
//# sourceMappingURL=UnknownType.js.map