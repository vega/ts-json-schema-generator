import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { UndefinedType } from "../Type/UndefinedType";
export declare class UndefinedTypeFormatter implements SubTypeFormatter {
    supportsType(type: UndefinedType): boolean;
    getDefinition(type: UndefinedType): Definition;
    getChildren(type: UndefinedType): BaseType[];
}
