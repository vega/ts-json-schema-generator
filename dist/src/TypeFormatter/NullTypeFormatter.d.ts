import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { NullType } from "../Type/NullType.js";
export declare class NullTypeFormatter implements SubTypeFormatter {
    supportsType(type: BaseType): boolean;
    getDefinition(type: NullType): Definition;
    getChildren(type: NullType): BaseType[];
}
