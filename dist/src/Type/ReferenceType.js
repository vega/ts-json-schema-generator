"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceType = void 0;
const BaseType_1 = require("./BaseType");
class ReferenceType extends BaseType_1.BaseType {
    constructor() {
        super(...arguments);
        this.type = null;
        this.id = null;
        this.name = null;
    }
    getId() {
        if (this.id == null) {
            throw new Error("Reference type ID not set yet");
        }
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getName() {
        if (this.name == null) {
            throw new Error("Reference type name not set yet");
        }
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getType() {
        if (this.type == null) {
            throw new Error("Reference type not set yet");
        }
        return this.type;
    }
    hasType() {
        return this.type != null;
    }
    setType(type) {
        this.type = type;
        this.setId(type.getId());
        this.setName(type.getName());
    }
}
exports.ReferenceType = ReferenceType;
//# sourceMappingURL=ReferenceType.js.map