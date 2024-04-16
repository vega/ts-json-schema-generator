import { AliasType } from "../Type/AliasType.js";
import { AnnotatedType } from "../Type/AnnotatedType.js";
import { BaseType } from "../Type/BaseType.js";
import { DefinitionType } from "../Type/DefinitionType.js";
import { ReferenceType } from "../Type/ReferenceType.js";

/**
 * Dereference the type as far as possible.
 */
export function derefType(type: BaseType): BaseType {
    if (type instanceof DefinitionType || type instanceof AliasType || type instanceof AnnotatedType) {
        return derefType(type.getType());
    }
    if (type instanceof ReferenceType && type.hasType()) {
        return derefType(type.getType());
    }

    return type;
}

export function derefAnnotatedType(type: BaseType): BaseType {
    if (type instanceof AnnotatedType || type instanceof AliasType) {
        return derefAnnotatedType(type.getType());
    }

    return type;
}
