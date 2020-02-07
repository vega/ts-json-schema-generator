import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { RestType } from "../Type/RestType";
import { TypeFormatter } from "../TypeFormatter";

export class RestTypeFormatter implements SubTypeFormatter {
    public constructor(private childTypeFormatter: TypeFormatter) {}

    public supportsType(type: RestType): boolean {
        return type instanceof RestType;
    }
    public getDefinition(type: RestType): Definition | undefined {
        return this.childTypeFormatter.getDefinition(type.getType());
    }
    public getChildren(type: RestType): BaseType[] {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
