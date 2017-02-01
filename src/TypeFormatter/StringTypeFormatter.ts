import { SubTypeFormatter } from "../SubTypeFormatter";
import { StringType } from "../Type/StringType";
import { BaseType } from "../Type/BaseType";
import { Definition } from "../Schema/Definition";

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
