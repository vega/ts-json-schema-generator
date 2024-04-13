import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { VoidType } from "../Type/VoidType";

export class VoidTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof VoidType;
    }
    public getDefinition(type: VoidType): Definition {
        return { type: "null" };
    }
    public getChildren(type: VoidType): BaseType[] {
        return [];
    }
}
