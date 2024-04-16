import { BaseType } from "../Type/BaseType.js";
import { AnnotatedType } from "../Type/AnnotatedType.js";

/**
 * Return the new type wrapped in an annotated type with the same annotations as the original type.
 * @param originalType The original type. If this is an annotated type,
 *      then the returned type will be wrapped with the same annotations.
 * @param newType The type to be wrapped.
 */
export function preserveAnnotation(originalType: BaseType, newType: BaseType): BaseType {
    if (originalType instanceof AnnotatedType) {
        return new AnnotatedType(newType, originalType.getAnnotations(), originalType.isNullable());
    }
    return newType;
}
