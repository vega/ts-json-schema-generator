import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { AliasType } from "../Type/AliasType.js";
import { BaseType } from "../Type/BaseType.js";
import { TypeFormatter } from "../TypeFormatter.js";

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
