import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { UnknownType } from "../Type/UnknownType";
export declare class UnknownTypeFormatter implements SubTypeFormatter {
    supportsType(type: UnknownType): boolean;
    getDefinition(type: UnknownType): Definition;
    getChildren(type: UnknownType): BaseType[];
}
