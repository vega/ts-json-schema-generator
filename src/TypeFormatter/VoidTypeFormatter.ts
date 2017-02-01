import { SubTypeFormatter } from "../SubTypeFormatter";
import { VoidType } from "../Type/VoidType";
import { BaseType } from "../Type/BaseType";
import { Definition } from "../Schema/Definition";

export class VoidTypeFormatter implements SubTypeFormatter {
    public supportsType(type: VoidType): boolean {
        return type instanceof VoidType;
    }
    public getDefinition(type: VoidType): Definition {
        return {type: "null"};
    }
    public getChildren(type: VoidType): BaseType[] {
        return [];
    }
}
