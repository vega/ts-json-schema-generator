import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { AnyType } from "../Type/AnyType";
import { BaseType } from "../Type/BaseType";

export class AnyTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof AnyType;
    }
    public getDefinition(type: AnyType): Definition {
        return {};
    }
    public getChildren(type: AnyType): BaseType[] {
        return [];
    }
}
