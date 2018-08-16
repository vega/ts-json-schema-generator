import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { NumberType } from "../Type/NumberType";

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
