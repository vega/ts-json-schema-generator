import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { OptionalType } from "../Type/OptionalType.js";
import type { TypeFormatter } from "../TypeFormatter.js";

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
