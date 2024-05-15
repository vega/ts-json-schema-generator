import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { AnyType } from "../Type/AnyType.js";
import { BaseType } from "../Type/BaseType.js";

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
