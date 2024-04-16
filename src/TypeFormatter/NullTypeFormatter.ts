import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { NullType } from "../Type/NullType.js";

export class NullTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof NullType;
    }
    public getDefinition(type: NullType): Definition {
        return { type: "null" };
    }
    public getChildren(type: NullType): BaseType[] {
        return [];
    }
}
