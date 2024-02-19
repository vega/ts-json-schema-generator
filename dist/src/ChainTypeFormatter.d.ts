import { MutableTypeFormatter } from "./MutableTypeFormatter";
import { Definition } from "./Schema/Definition";
import { SubTypeFormatter } from "./SubTypeFormatter";
import { BaseType } from "./Type/BaseType";
export declare class ChainTypeFormatter implements SubTypeFormatter, MutableTypeFormatter {
    protected typeFormatters: SubTypeFormatter[];
    constructor(typeFormatters: SubTypeFormatter[]);
    addTypeFormatter(typeFormatter: SubTypeFormatter): this;
    supportsType(type: BaseType): boolean;
    getDefinition(type: BaseType): Definition;
    getChildren(type: BaseType): BaseType[];
    protected getTypeFormatter(type: BaseType): SubTypeFormatter;
}
