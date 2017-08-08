"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseType_1 = require("./BaseType");
class DefinitionType extends BaseType_1.BaseType {
    constructor(name, type) {
        super();
        this.name = name;
        this.type = type;
    }
    getId() {
        return this.name;
    }
    getType() {
        return this.type;
    }
}
exports.DefinitionType = DefinitionType;
//# sourceMappingURL=DefinitionType.js.map