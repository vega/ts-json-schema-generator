import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import { AnnotatedType } from "../Type/AnnotatedType.js";
import type { BaseType } from "../Type/BaseType.js";
import type { GetDefinitionOptions } from "../TypeFormatter.js";
import type { TypeFormatter } from "../TypeFormatter.js";
export declare function makeNullable(def: Definition): Definition;
export declare class AnnotatedTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    constructor(childTypeFormatter: TypeFormatter);
    supportsType(type: BaseType): boolean;
    getDefinition(type: AnnotatedType, options?: GetDefinitionOptions): Definition;
    getChildren(type: AnnotatedType): BaseType[];
}
