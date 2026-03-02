import type { Definition } from "./Schema/Definition.js";
import type { BaseType } from "./Type/BaseType.js";
import type { StringMap } from "./Utils/StringMap.js";

export interface GetDefinitionOptions {
    definitions?: StringMap<Definition>;
}

export interface TypeFormatter {
    getDefinition(type: BaseType, options?: GetDefinitionOptions): Definition;
    getChildren(type: BaseType): BaseType[];
}
