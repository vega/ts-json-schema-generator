import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { VoidType } from "../Type/VoidType.js";

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
