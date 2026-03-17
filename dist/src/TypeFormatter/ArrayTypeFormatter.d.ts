import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import { ArrayType } from "../Type/ArrayType.js";
import type { BaseType } from "../Type/BaseType.js";
import type { GetDefinitionOptions } from "../TypeFormatter.js";
import type { TypeFormatter } from "../TypeFormatter.js";
export declare class ArrayTypeFormatter implements SubTypeFormatter {
    private childTypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: BaseType): boolean;
    getDefinition(type: ArrayType, options?: GetDefinitionOptions): Definition;
    getChildren(type: ArrayType): BaseType[];
}
