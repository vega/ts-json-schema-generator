import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { BooleanType } from "../Type/BooleanType";

export class BooleanTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BooleanType): boolean {
        return type instanceof BooleanType;
    }
    public getDefinition(type: BooleanType): Definition {
        return { type: "boolean" };
    }
    public getChildren(type: BooleanType): BaseType[] {
        return [];
    }
}
