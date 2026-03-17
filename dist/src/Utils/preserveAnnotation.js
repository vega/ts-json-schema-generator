"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preserveAnnotation = preserveAnnotation;
const AnnotatedType_js_1 = require("../Type/AnnotatedType.js");
/**
 * Return the new type wrapped in an annotated type with the same annotations as the original type.
 * @param originalType The original type. If this is an annotated type,
 *      then the returned type will be wrapped with the same annotations.
 * @param newType The type to be wrapped.
 */
function preserveAnnotation(originalType, newType) {
    if (originalType instanceof AnnotatedType_js_1.AnnotatedType) {
        return new AnnotatedType_js_1.AnnotatedType(newType, originalType.getAnnotations(), originalType.isNullable());
    }
    return newType;
}
//# sourceMappingURL=preserveAnnotation.js.map