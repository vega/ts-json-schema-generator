import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { UnknownType } from "../Type/UnknownType.js";

export class UnknownTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof UnknownType;
    }
    public getDefinition(type: UnknownType): Definition {
        return {};
    }
    public getChildren(type: UnknownType): BaseType[] {
        return [];
    }
}
