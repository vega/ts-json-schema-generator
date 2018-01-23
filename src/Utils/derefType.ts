import { BaseType } from "../Type/BaseType";
import { ReferenceType } from "../Type/ReferenceType";
import { DefinitionType } from "../Type/DefinitionType";
import { AliasType } from "../Type/AliasType";
import { AnnotatedType } from "../Type/AnnotatedType";

export function derefType(type: BaseType): BaseType {
    if (
        type instanceof ReferenceType ||
        type instanceof DefinitionType ||
        type instanceof AliasType ||
        type instanceof AnnotatedType
    ) {
        return derefType(type.getType());
    }

    return type;
}
