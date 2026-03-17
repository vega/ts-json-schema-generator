import type { MutableTypeFormatter } from "./MutableTypeFormatter.js";
import type { Definition } from "./Schema/Definition.js";
import type { SubTypeFormatter } from "./SubTypeFormatter.js";
import type { BaseType } from "./Type/BaseType.js";
import type { GetDefinitionOptions } from "./TypeFormatter.js";
export declare class ChainTypeFormatter implements SubTypeFormatter, MutableTypeFormatter {
    protected typeFormatters: SubTypeFormatter[];
    constructor(typeFormatters: SubTypeFormatter[]);
    addTypeFormatter(typeFormatter: SubTypeFormatter): this;
    supportsType(type: BaseType): boolean;
    getDefinition(type: BaseType, options?: GetDefinitionOptions): Definition;
    getChildren(type: BaseType): BaseType[];
    protected getTypeFormatter(type: BaseType): SubTypeFormatter;
}
