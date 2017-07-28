"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseType_1 = require("./BaseType");
class AliasType extends BaseType_1.BaseType {
    constructor(id, type) {
        super();
        this.id = id;
        this.type = type;
    }
    getId() {
        return this.id;
    }
    getType() {
        return this.type;
    }
}
exports.AliasType = AliasType;
//# sourceMappingURL=AliasType.js.map