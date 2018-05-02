import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { BooleanType } from "../Type/BooleanType";
export declare class BooleanTypeFormatter implements SubTypeFormatter {
    supportsType(type: BooleanType): boolean;
    getDefinition(type: BooleanType): Definition;
    getChildren(type: BooleanType): BaseType[];
}
