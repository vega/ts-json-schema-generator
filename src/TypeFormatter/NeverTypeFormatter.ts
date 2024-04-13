import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { NeverType } from "../Type/NeverType";

export class NeverTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof NeverType;
    }
    public getDefinition(type: NeverType): Definition {
        return { not: {} };
    }
    public getChildren(type: NeverType): BaseType[] {
        return [];
    }
}
