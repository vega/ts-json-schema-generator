import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { StringType } from "../Type/StringType.js";

export class StringTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof StringType;
    }
    public getDefinition(type: StringType): Definition {
        return { type: "string" };
    }
    public getChildren(type: StringType): BaseType[] {
        return [];
    }
}
