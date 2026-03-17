"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalTypeFormatter = void 0;
const OptionalType_js_1 = require("../Type/OptionalType.js");
class OptionalTypeFormatter {
    childTypeFormatter;
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof OptionalType_js_1.OptionalType;
    }
    getDefinition(type, options) {
        return this.childTypeFormatter.getDefinition(type.getType(), options);
    }
    getChildren(type) {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
exports.OptionalTypeFormatter = OptionalTypeFormatter;
//# sourceMappingURL=OptionalTypeFormatter.js.map