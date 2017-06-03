import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { NullType } from "../Type/NullType";

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
