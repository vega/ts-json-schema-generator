"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayTypeFormatter = void 0;
const ArrayType_js_1 = require("../Type/ArrayType.js");
class ArrayTypeFormatter {
    childTypeFormatter;
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof ArrayType_js_1.ArrayType;
    }
    getDefinition(type, options) {
        return {
            type: "array",
            items: this.childTypeFormatter.getDefinition(type.getItem(), options),
        };
    }
    getChildren(type) {
        return this.childTypeFormatter.getChildren(type.getItem());
    }
}
exports.ArrayTypeFormatter = ArrayTypeFormatter;
//# sourceMappingURL=ArrayTypeFormatter.js.map