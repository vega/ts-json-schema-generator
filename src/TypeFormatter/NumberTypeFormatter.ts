import { SubTypeFormatter } from "../SubTypeFormatter";
import { NumberType } from "../Type/NumberType";
import { BaseType } from "../Type/BaseType";
import { Definition } from "../Schema/Definition";

export class NumberTypeFormatter implements SubTypeFormatter {
    public supportsType(type: NumberType): boolean {
        return type instanceof NumberType;
    }
    public getDefinition(type: NumberType): Definition {
        return {type: "number"};
    }
    public getChildren(type: NumberType): BaseType[] {
        return [];
    }
}
