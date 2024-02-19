import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { NeverType } from "../Type/NeverType";
export declare class NeverTypeFormatter implements SubTypeFormatter {
    supportsType(type: NeverType): boolean;
    getDefinition(type: NeverType): Definition;
    getChildren(type: NeverType): BaseType[];
}
