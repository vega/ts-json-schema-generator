import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import { AliasType } from "../Type/AliasType.js";
import type { BaseType } from "../Type/BaseType.js";
import type { GetDefinitionOptions } from "../TypeFormatter.js";
import type { TypeFormatter } from "../TypeFormatter.js";
export declare class AliasTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: BaseType): boolean;
    getDefinition(type: AliasType, options?: GetDefinitionOptions): Definition;
    getChildren(type: AliasType): BaseType[];
}
