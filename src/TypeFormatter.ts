import { Definition } from "./Schema/Definition";
import { BaseType } from "./Type/BaseType";

export interface TypeFormatter {
    getDefinition(type: BaseType): Definition | undefined;
    getChildren(type: BaseType): BaseType[];
}
