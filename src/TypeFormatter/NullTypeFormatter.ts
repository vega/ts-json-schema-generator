import { SubTypeFormatter } from "../SubTypeFormatter";
import { NullType } from "../Type/NullType";
import { BaseType } from "../Type/BaseType";
import { Definition } from "../Schema/Definition";

export class NullTypeFormatter implements SubTypeFormatter {
    public supportsType(type: NullType): boolean {
        return type instanceof NullType;
    }
    public getDefinition(type: NullType): Definition {
        return {type: "null"};
    }
    public getChildren(type: NullType): BaseType[] {
        return [];
    }
}
