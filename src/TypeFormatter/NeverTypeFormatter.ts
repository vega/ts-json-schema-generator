import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
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
