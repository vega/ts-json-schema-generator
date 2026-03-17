"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestTypeFormatter = void 0;
const RestType_js_1 = require("../Type/RestType.js");
class RestTypeFormatter {
    childTypeFormatter;
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof RestType_js_1.RestType;
    }
    getDefinition(type, options) {
        const definition = this.childTypeFormatter.getDefinition(type.getType(), options);
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