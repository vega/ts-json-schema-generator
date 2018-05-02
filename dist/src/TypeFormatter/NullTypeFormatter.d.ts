import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { NullType } from "../Type/NullType";
export declare class NullTypeFormatter implements SubTypeFormatter {
    supportsType(type: NullType): boolean;
    getDefinition(type: NullType): Definition;
    getChildren(type: NullType): BaseType[];
}
