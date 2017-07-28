"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AliasType_1 = require("../Type/AliasType");
class AliasTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof AliasType_1.AliasType;
    }
    getDefinition(type) {
        return this.childTypeFormatter.getDefinition(type.getType());
    }
    getChildren(type) {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
exports.AliasTypeFormatter = AliasTypeFormatter;
//# sourceMappingURL=AliasTypeFormatter.js.map