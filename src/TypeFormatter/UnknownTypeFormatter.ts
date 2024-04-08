import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { UnknownType } from "../Type/UnknownType";

export class UnknownTypeFormatter implements SubTypeFormatter {
    public supportsType(type: UnknownType): boolean {
        return type instanceof UnknownType;
    }
    public getDefinition(type: UnknownType): Definition {
        return {};
    }
    public getChildren(type: UnknownType): BaseType[] {
        return [];
    }
}
