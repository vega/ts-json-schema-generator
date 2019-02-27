import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { VoidType } from "../Type/VoidType";

export class VoidKeywordFormatter implements SubTypeFormatter {
    public supportsType(type: VoidType): boolean {
        return type instanceof VoidType;
    }
    public getDefinition(type: VoidType): Definition {
        return { type: "void" };
    }
    public getChildren(type: VoidType): BaseType[] {
        return [];
    }
}
