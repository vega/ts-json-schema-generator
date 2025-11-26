import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
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
