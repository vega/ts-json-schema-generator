import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { StringType } from "../Type/StringType";
export declare class StringTypeFormatter implements SubTypeFormatter {
    supportsType(type: StringType): boolean;
    getDefinition(type: StringType): Definition;
    getChildren(type: StringType): BaseType[];
}
