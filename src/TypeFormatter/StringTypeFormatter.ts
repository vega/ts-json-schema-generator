import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { StringType } from "../Type/StringType";

export class StringTypeFormatter implements SubTypeFormatter {
    public supportsType(type: StringType): boolean {
        return type instanceof StringType;
    }
    public getDefinition(type: StringType): Definition {
        return {type: "string"};
    }
    public getChildren(type: StringType): BaseType[] {
        return [];
    }
}
