import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { NumberType } from "../Type/NumberType.js";

export class NumberTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof NumberType;
    }
    public getDefinition(type: NumberType): Definition {
        return { type: "number" };
    }
    public getChildren(type: NumberType): BaseType[] {
        return [];
    }
}
