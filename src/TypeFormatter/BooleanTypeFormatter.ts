import { SubTypeFormatter } from "../SubTypeFormatter";
import { BooleanType } from "../Type/BooleanType";
import { BaseType } from "../Type/BaseType";
import { Definition } from "../Schema/Definition";

export class BooleanTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BooleanType): boolean {
        return type instanceof BooleanType;
    }
    public getDefinition(type: BooleanType): Definition {
        return {type: "boolean"};
    }
    public getChildren(type: BooleanType): BaseType[] {
        return [];
    }
}
