import { SubTypeFormatter } from "../SubTypeFormatter";
import { UndefinedType } from "../Type/UndefinedType";
import { BaseType } from "../Type/BaseType";
import { Definition } from "../Schema/Definition";

export class UndefinedTypeFormatter implements SubTypeFormatter {
    public supportsType(type: UndefinedType): boolean {
        return type instanceof UndefinedType;
    }
    public getDefinition(type: UndefinedType): Definition {
        return {not: {}};
    }
    public getChildren(type: UndefinedType): BaseType[] {
        return [];
    }
}
