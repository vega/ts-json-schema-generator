"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceType = void 0;
const Errors_js_1 = require("../Error/Errors.js");
const BaseType_js_1 = require("./BaseType.js");
class ReferenceType extends BaseType_js_1.BaseType {
    type = null;
    id = null;
    name = null;
    getId() {
        if (this.id == null) {
            throw new Errors_js_1.JsonTypeError("Reference type ID not set yet", this);
        }
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getName() {
        if (this.name == null) {
            throw new Errors_js_1.JsonTypeError("Reference type name not set yet", this);
        }
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getType() {
        if (this.type == null) {
            throw new Errors_js_1.JsonTypeError("Reference type not set yet", this);
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