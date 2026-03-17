import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { NeverType } from "../Type/NeverType.js";
export declare class NeverTypeFormatter implements SubTypeFormatter {
    supportsType(type: BaseType): boolean;
    getDefinition(type: NeverType): Definition;
    getChildren(type: NeverType): BaseType[];
}
