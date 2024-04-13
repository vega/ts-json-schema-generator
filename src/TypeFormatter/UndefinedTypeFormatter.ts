import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { UndefinedType } from "../Type/UndefinedType";

export class UndefinedTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof UndefinedType;
    }
    public getDefinition(type: UndefinedType): Definition {
        return { not: {} };
    }
    public getChildren(type: UndefinedType): BaseType[] {
        return [];
    }
}
