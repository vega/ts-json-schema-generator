import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { AnyType } from "../Type/AnyType";
import { BaseType } from "../Type/BaseType";
export declare class AnyTypeFormatter implements SubTypeFormatter {
    supportsType(type: AnyType): boolean;
    getDefinition(type: AnyType): Definition;
    getChildren(type: AnyType): BaseType[];
}
