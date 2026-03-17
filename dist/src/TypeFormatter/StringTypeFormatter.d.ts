import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { StringType } from "../Type/StringType.js";
export declare class StringTypeFormatter implements SubTypeFormatter {
    supportsType(type: BaseType): boolean;
    getDefinition(type: StringType): Definition;
    getChildren(type: StringType): BaseType[];
}
