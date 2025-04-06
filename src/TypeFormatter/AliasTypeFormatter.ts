import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import { AliasType } from "../Type/AliasType.js";
import type { BaseType } from "../Type/BaseType.js";
import type { TypeFormatter } from "../TypeFormatter.js";

export class AliasTypeFormatter implements SubTypeFormatter {
    public constructor(protected childTypeFormatter: TypeFormatter) {}

    public supportsType(type: BaseType): boolean {
        return type instanceof AliasType;
    }
    public getDefinition(type: AliasType): Definition {
        return this.childTypeFormatter.getDefinition(type.getType());
    }
    public getChildren(type: AliasType): BaseType[] {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
