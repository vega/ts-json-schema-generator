import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { HiddenType } from "../Type/HiddenType";
export declare class HiddenTypeFormatter implements SubTypeFormatter {
    supportsType(type: HiddenType): boolean;
    getDefinition(type: HiddenType): Definition;
    getChildren(type: HiddenType): BaseType[];
}
