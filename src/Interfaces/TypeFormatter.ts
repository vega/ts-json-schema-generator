import { Definition } from "../Schema/Definition.js";
import { BaseType } from "../Type/BaseType.js";

export interface TypeFormatter {
    getDefinition(type: BaseType): Definition;
    getChildren(type: BaseType): BaseType[];
}
