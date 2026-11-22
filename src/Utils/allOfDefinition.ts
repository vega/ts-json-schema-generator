import type { Definition } from "../Schema/Definition.js";
import type { BaseType } from "../Type/BaseType.js";
import type { TypeFormatter } from "../TypeFormatter.js";
import { mergeObjectDefinitions } from "./deepMerge.js";
import { derefType } from "./derefType.js";

// TODO: Can we do this at parse time? See heritage clause in interfaces.
// TODO: We really only need this if the children use additionalProperties: false.
export function getAllOfDefinitionReducer(childTypeFormatter: TypeFormatter) {
    // combine object instead of using allOf because allOf does not work well with additional properties
    return (definition: Definition, baseType: BaseType): Definition => {
        const other = childTypeFormatter.getDefinition(derefType(baseType));
        return mergeObjectDefinitions(definition, other);
    };
}
