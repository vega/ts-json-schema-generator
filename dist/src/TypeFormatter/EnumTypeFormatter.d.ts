import type { JSONSchema7TypeName } from "json-schema";
import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { EnumType } from "../Type/EnumType.js";
export declare class EnumTypeFormatter implements SubTypeFormatter {
    supportsType(type: BaseType): boolean;
    getDefinition(type: EnumType): Definition;
    getChildren(type: EnumType): BaseType[];
}
/**
 * Unwraps the array if it contains only one type.
 */
export declare function toEnumType(types: JSONSchema7TypeName[]): JSONSchema7TypeName | JSONSchema7TypeName[];
