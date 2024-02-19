"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestTypeFormatter = void 0;
const RestType_1 = require("../Type/RestType");
class RestTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof RestType_1.RestType;
    }
    getDefinition(type) {
        const definition = this.childTypeFormatter.getDefinition(type.getType());
        const title = type.getTitle();
        if (title !== null && typeof definition.items === "object") {
            return { ...definition, items: { ...definition.items, title } };
        }
        return definition;
    }
    getChildren(type) {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
exports.RestTypeFormatter = RestTypeFormatter;
//# sourceMappingURL=RestTypeFormatter.js.map