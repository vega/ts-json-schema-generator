import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { DefinitionType } from "../Type/DefinitionType.js";
import type { TypeFormatter } from "../TypeFormatter.js";
export declare class DefinitionTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    protected encodeRefs: boolean;
    constructor(childTypeFormatter: TypeFormatter, encodeRefs: boolean);
    supportsType(type: BaseType): boolean;
    getDefinition(type: DefinitionType): Definition;
    getChildren(type: DefinitionType): BaseType[];
}
