import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { ReferenceType } from "../Type/ReferenceType.js";
import type { TypeFormatter } from "../TypeFormatter.js";
export declare class ReferenceTypeFormatter implements SubTypeFormatter {
    protected childTypeFormatter: TypeFormatter;
    protected encodeRefs: boolean;
    constructor(childTypeFormatter: TypeFormatter, encodeRefs: boolean);
    supportsType(type: BaseType): boolean;
    getDefinition(type: ReferenceType): Definition;
    getChildren(type: ReferenceType): BaseType[];
}
