"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotatedType = void 0;
const BaseType_1 = require("./BaseType");
const nodeKey_1 = require("../Utils/nodeKey");
class AnnotatedType extends BaseType_1.BaseType {
    constructor(type, annotations, nullable) {
        super();
        this.type = type;
        this.annotations = annotations;
        this.nullable = nullable;
    }
    getId() {
        return this.type.getId() + (0, nodeKey_1.hash)([this.isNullable(), this.annotations]);
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