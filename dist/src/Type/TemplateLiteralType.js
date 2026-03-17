"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateLiteralType = void 0;
const BaseType_js_1 = require("./BaseType.js");
class TemplateLiteralType extends BaseType_js_1.BaseType {
    types;
    constructor(types) {
        super();
        this.types = types;
    }
    getId() {
        return `template-literal-${this.getParts()
            .map((part) => part.getId())
            .join("-")}`;
    }
    getParts() {
        return this.types;
    }
}
exports.TemplateLiteralType = TemplateLiteralType;
//# sourceMappingURL=TemplateLiteralType.js.map