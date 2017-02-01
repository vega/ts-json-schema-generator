import { BaseType } from "./Type/BaseType";
import { Definition } from "./Schema/Definition";

export interface TypeFormatter {
    getDefinition(type: BaseType): Definition;
    getChildren(type: BaseType): BaseType[];
}
