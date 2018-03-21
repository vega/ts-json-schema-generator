import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { EnumType } from "../Type/EnumType";
export declare class EnumTypeFormatter implements SubTypeFormatter {
    supportsType(type: EnumType): boolean;
    getDefinition(type: EnumType): Definition;
    getChildren(type: EnumType): BaseType[];
    private getValueType(value);
}
