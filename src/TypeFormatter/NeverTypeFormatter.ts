import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { NeverType } from "../Type/NeverType.js";

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
