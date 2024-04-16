import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { HiddenType } from "../Type/HiddenType";

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
