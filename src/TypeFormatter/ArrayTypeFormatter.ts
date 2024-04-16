import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { ArrayType } from "../Type/ArrayType.js";
import { BaseType } from "../Type/BaseType.js";
import { TypeFormatter } from "../TypeFormatter.js";

export class ArrayTypeFormatter implements SubTypeFormatter {
    public constructor(private childTypeFormatter: TypeFormatter) {}

    public supportsType(type: BaseType): boolean {
        return type instanceof ArrayType;
    }
    public getDefinition(type: ArrayType): Definition {
        return {
            type: "array",
            items: this.childTypeFormatter.getDefinition(type.getItem()),
        };
    }
    public getChildren(type: ArrayType): BaseType[] {
        return this.childTypeFormatter.getChildren(type.getItem());
    }
}
