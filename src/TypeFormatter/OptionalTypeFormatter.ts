import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { OptionalType } from "../Type/OptionalType.js";
import { TypeFormatter } from "../TypeFormatter.js";

export class OptionalTypeFormatter implements SubTypeFormatter {
    public constructor(protected childTypeFormatter: TypeFormatter) {}

    public supportsType(type: BaseType): boolean {
        return type instanceof OptionalType;
    }
    public getDefinition(type: OptionalType): Definition {
        return this.childTypeFormatter.getDefinition(type.getType());
    }
    public getChildren(type: OptionalType): BaseType[] {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
