"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preserveAnnotation = void 0;
const AnnotatedType_1 = require("../Type/AnnotatedType");
function preserveAnnotation(originalType, newType) {
    if (originalType instanceof AnnotatedType_1.AnnotatedType) {
        return new AnnotatedType_1.AnnotatedType(newType, originalType.getAnnotations(), originalType.isNullable());
    }
    return newType;
}
exports.preserveAnnotation = preserveAnnotation;
//# sourceMappingURL=preserveAnnotation.js.map