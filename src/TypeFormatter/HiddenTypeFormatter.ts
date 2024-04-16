import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { HiddenType } from "../Type/HiddenType.js";

export class HiddenTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof HiddenType;
    }
    public getDefinition(type: HiddenType): Definition {
        return { additionalProperties: false };
    }
    public getChildren(type: HiddenType): BaseType[] {
        return [];
    }
}
