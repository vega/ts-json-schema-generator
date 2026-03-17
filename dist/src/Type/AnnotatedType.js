"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotatedType = void 0;
const BaseType_js_1 = require("./BaseType.js");
const nodeKey_js_1 = require("../Utils/nodeKey.js");
class AnnotatedType extends BaseType_js_1.BaseType {
    type;
    annotations;
    nullable;
    constructor(type, annotations, nullable) {
        super();
        this.type = type;
        this.annotations = annotations;
        this.nullable = nullable;
    }
    getId() {
        return this.type.getId() + (0, nodeKey_js_1.hash)([this.isNullable(), this.annotations]);
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