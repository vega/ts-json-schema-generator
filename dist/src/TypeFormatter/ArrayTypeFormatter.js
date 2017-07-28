"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayType_1 = require("../Type/ArrayType");
class ArrayTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof ArrayType_1.ArrayType;
    }
    getDefinition(type) {
        return {
            type: "array",
            items: this.childTypeFormatter.getDefinition(type.getItem()),
        };
    }
    getChildren(type) {
        return this.childTypeFormatter.getChildren(type.getItem());
    }
}
exports.ArrayTypeFormatter = ArrayTypeFormatter;
//# sourceMappingURL=ArrayTypeFormatter.js.map