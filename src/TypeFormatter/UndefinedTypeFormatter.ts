import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { UndefinedType } from "../Type/UndefinedType.js";

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
