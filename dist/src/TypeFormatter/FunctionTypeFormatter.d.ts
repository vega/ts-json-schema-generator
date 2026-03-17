import type { FunctionOptions } from "../Config.js";
import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { FunctionType } from "../Type/FunctionType.js";
import type { GetDefinitionOptions } from "../TypeFormatter.js";
import type { TypeFormatter } from "../TypeFormatter.js";
export declare class FunctionTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    protected functions: FunctionOptions;
    constructor(childTypeFormatter: TypeFormatter, functions: FunctionOptions);
    supportsType(type: BaseType): boolean;
    getDefinition(type: FunctionType, options?: GetDefinitionOptions): Definition;
    getChildren(type: FunctionType): BaseType[];
}
