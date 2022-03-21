import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { OptionalType } from "../Type/OptionalType";
import { TypeFormatter } from "../TypeFormatter";

export class OptionalTypeFormatter implements SubTypeFormatter {
    public constructor(protected childTypeFormatter: TypeFormatter) {}

    public supportsType(type: OptionalType): boolean {
        return type instanceof OptionalType;
    }
    public getDefinition(type: OptionalType): Definition {
        return this.childTypeFormatter.getDefinition(type.getType());
    }
    public getChildren(type: OptionalType): BaseType[] {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
