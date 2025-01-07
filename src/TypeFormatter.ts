import type { Definition } from "./Schema/Definition.js";
import type { BaseType } from "./Type/BaseType.js";

export interface TypeFormatter {
    getDefinition(type: BaseType): Definition;
    getChildren(type: BaseType): BaseType[];
}
