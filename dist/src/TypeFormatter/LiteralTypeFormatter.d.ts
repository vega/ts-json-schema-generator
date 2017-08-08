import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";
export declare class LiteralTypeFormatter implements SubTypeFormatter {
    supportsType(type: LiteralType): boolean;
    getDefinition(type: LiteralType): Definition;
    getChildren(type: LiteralType): BaseType[];
}
