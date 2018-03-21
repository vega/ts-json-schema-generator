import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { VoidType } from "../Type/VoidType";
export declare class VoidTypeFormatter implements SubTypeFormatter {
    supportsType(type: VoidType): boolean;
    getDefinition(type: VoidType): Definition;
    getChildren(type: VoidType): BaseType[];
}
