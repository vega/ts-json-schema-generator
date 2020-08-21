import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";
import { typeName } from "../Utils/typeName";

export class LiteralTypeFormatter implements SubTypeFormatter {
    public supportsType(type: LiteralType): boolean {
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
