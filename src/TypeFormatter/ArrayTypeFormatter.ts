import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";
import { TypeFormatter } from "../TypeFormatter";

export class ArrayTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: ArrayType): boolean {
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
