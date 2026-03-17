"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownTypeFormatter = void 0;
const UnknownType_js_1 = require("../Type/UnknownType.js");
class UnknownTypeFormatter {
    supportsType(type) {
        return type instanceof UnknownType_js_1.UnknownType;
    }
    getDefinition(type) {
        if (type.erroredSource) {
            return { description: "Failed to correctly infer type" };
        }
        return {};
    }
    getChildren() {
        return [];
    }
}
exports.UnknownTypeFormatter = UnknownTypeFormatter;
//# sourceMappingURL=UnknownTypeFormatter.js.map