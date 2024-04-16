import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { typeName } from "../Utils/typeName.js";

export class LiteralTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof LiteralType;
    }
    public getDefinition(type: LiteralType): Definition {
        return {
            type: typeName(type.getValue()),
            const: type.getValue(),
        };
    }
    public getChildren(type: LiteralType): BaseType[] {
        return [];
    }
}
