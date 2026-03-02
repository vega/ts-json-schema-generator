import type { Definition } from "../Schema/Definition.js";
import type { BaseType } from "../Type/BaseType.js";
import type { GetDefinitionOptions } from "../TypeFormatter.js";

export interface TypeFormatter {
    getDefinition(type: BaseType, options?: GetDefinitionOptions): Definition;
    getChildren(type: BaseType): BaseType[];
}
