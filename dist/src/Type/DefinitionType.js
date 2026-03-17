"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefinitionType = void 0;
const BaseType_js_1 = require("./BaseType.js");
class DefinitionType extends BaseType_js_1.BaseType {
    name;
    type;
    constructor(name, type) {
        super();
        this.name = name;
        this.type = type;
    }
    getId() {
        return `def-${this.type.getId()}`;
    }
    getName() {
        return this.name || super.getName();
    }
    getType() {
        return this.type;
    }
}
exports.DefinitionType = DefinitionType;
//# sourceMappingURL=DefinitionType.js.map