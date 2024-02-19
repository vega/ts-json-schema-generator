"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownTypeFormatter = void 0;
const UnknownType_1 = require("../Type/UnknownType");
class UnknownTypeFormatter {
    supportsType(type) {
        return type instanceof UnknownType_1.UnknownType;
    }
    getDefinition(type) {
        return {
            $comment: type.getComment(),
        };
    }
    getChildren(type) {
        return [];
    }
}
exports.UnknownTypeFormatter = UnknownTypeFormatter;
//# sourceMappingURL=UnknownTypeFormatter.js.map