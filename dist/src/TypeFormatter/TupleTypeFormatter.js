"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TupleType_1 = require("../Type/TupleType");
class TupleTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof TupleType_1.TupleType;
    }
    getDefinition(type) {
        const tupleDefinitions = type.getTypes()
            .map((item) => this.childTypeFormatter.getDefinition(item));
        return Object.assign({ type: "array", items: tupleDefinitions, minItems: tupleDefinitions.length }, (tupleDefinitions.length > 1 ? { additionalItems: { anyOf: tupleDefinitions } } : {}));
    }
    getChildren(type) {
        return type.getTypes().reduce((result, item) => [
            ...result,
            ...this.childTypeFormatter.getChildren(item),
        ], []);
    }
}
exports.TupleTypeFormatter = TupleTypeFormatter;
//# sourceMappingURL=TupleTypeFormatter.js.map