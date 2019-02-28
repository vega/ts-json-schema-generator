import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { UnknownNodeType } from "../Type/UnknownNodeType";

export class UnknownNodeFormatter implements SubTypeFormatter {
    public supportsType(type: UnknownNodeType): boolean {
        return type instanceof UnknownNodeType;
    }
    public getDefinition(type: UnknownNodeType): Definition {
        return { type: type.getId() };
    }
    public getChildren(type: UnknownNodeType): BaseType[] {
        return [];
    }
}
