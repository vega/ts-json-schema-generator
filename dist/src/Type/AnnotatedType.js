"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseType_1 = require("./BaseType");
class AnnotatedType extends BaseType_1.BaseType {
    constructor(type, annotations, nullable) {
        super();
        this.type = type;
        this.annotations = annotations;
        this.nullable = nullable;
    }
    getId() {
        return this.type.getId();
    }
    getType() {
        return this.type;
    }
    getAnnotations() {
        return this.annotations;
    }
    isNullable() {
        return this.nullable;
    }
}
exports.AnnotatedType = AnnotatedType;
//# sourceMappingURL=AnnotatedType.js.map