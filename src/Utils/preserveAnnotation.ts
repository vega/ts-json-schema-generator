import type { BaseType } from "../Type/BaseType.js";
import { AnnotatedType } from "../Type/AnnotatedType.js";
import { AliasType } from "../Type/AliasType.js";
import { DefinitionType } from "../Type/DefinitionType.js";
import { ReferenceType } from "../Type/ReferenceType.js";

/**
 * Return the new type wrapped in an annotated type with the same annotations as the original type.
 * @param originalType The original type. If this is an annotated type (possibly wrapped in AliasType,
 *      DefinitionType, or ReferenceType), then the returned type will be wrapped with the same annotations.
 * @param newType The type to be wrapped.
 */
export function preserveAnnotation(originalType: BaseType, newType: BaseType): BaseType {
    if (originalType instanceof AnnotatedType) {
        return new AnnotatedType(newType, originalType.getAnnotations(), originalType.isNullable());
    }
    if (originalType instanceof AliasType || originalType instanceof DefinitionType) {
        return preserveAnnotation(originalType.getType(), newType);
    }
    if (originalType instanceof ReferenceType && originalType.hasType()) {
        return preserveAnnotation(originalType.getType(), newType);
    }
    return newType;
}
