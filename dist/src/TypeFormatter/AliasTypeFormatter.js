"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliasTypeFormatter = void 0;
const AliasType_js_1 = require("../Type/AliasType.js");
class AliasTypeFormatter {
    childTypeFormatter;
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof AliasType_js_1.AliasType;
    }
    getDefinition(type, options) {
        return this.childTypeFormatter.getDefinition(type.getType(), options);
    }
    getChildren(type) {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
exports.AliasTypeFormatter = AliasTypeFormatter;
//# sourceMappingURL=AliasTypeFormatter.js.map