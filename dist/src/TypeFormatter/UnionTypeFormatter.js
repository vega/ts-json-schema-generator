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
        const definitions = type.getTypes().map((item) => this.childTypeFormatter.getDefinition(item));
        let stringType = true;
        let oneNotEnum = false;
        for (const def of definitions) {
            if (def.type !== "string") {
                stringType = false;
                break;
            }
            if (def.enum === undefined) {
                oneNotEnum = true;
            }
        }
        if (stringType && oneNotEnum) {
            return {
                type: "string",
            };
        }
        return definitions.length > 1 ? {
            anyOf: definitions,
        } : definitions[0];
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