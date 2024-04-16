import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { BooleanType } from "../Type/BooleanType.js";

export class BooleanTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof BooleanType;
    }
    public getDefinition(type: BooleanType): Definition {
        return { type: "boolean" };
    }
    public getChildren(type: BooleanType): BaseType[] {
        return [];
    }
}
