import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { AliasType } from "../Type/AliasType";
import { BaseType } from "../Type/BaseType";
import { TypeFormatter } from "../TypeFormatter";

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
