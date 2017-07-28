"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseType_1 = require("./BaseType");
class ReferenceType extends BaseType_1.BaseType {
    getId() {
        return this.type.getId();
    }
    getType() {
        return this.type;
    }
    setType(type) {
        this.type = type;
    }
}
exports.ReferenceType = ReferenceType;
//# sourceMappingURL=ReferenceType.js.map