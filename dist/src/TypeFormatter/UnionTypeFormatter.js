"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UnionType_1 = require("../Type/UnionType");
class UnionTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof UnionType_1.UnionType;
    }
    getDefinition(type) {
        return {
            anyOf: type.getTypes().map((item) => this.childTypeFormatter.getDefinition(item)),
        };
    }
    getChildren(type) {
        return type.getTypes().reduce((result, item) => [
            ...result,
            ...this.childTypeFormatter.getChildren(item),
        ], []);
    }
}
exports.UnionTypeFormatter = UnionTypeFormatter;
//# sourceMappingURL=UnionTypeFormatter.js.map