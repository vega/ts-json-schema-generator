import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { TupleType } from "../Type/TupleType.js";
import type { GetDefinitionOptions } from "../TypeFormatter.js";
import type { TypeFormatter } from "../TypeFormatter.js";
export declare class TupleTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: BaseType): boolean;
    getDefinition(type: TupleType, options?: GetDefinitionOptions): Definition;
    getChildren(type: TupleType): BaseType[];
}
