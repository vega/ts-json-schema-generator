import type { Definition } from "../Schema/Definition.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import { ArrayType } from "../Type/ArrayType.js";
import type { BaseType } from "../Type/BaseType.js";
import type { GetDefinitionOptions } from "../TypeFormatter.js";
import type { TypeFormatter } from "../TypeFormatter.js";

export class ArrayTypeFormatter implements SubTypeFormatter {
    public constructor(private childTypeFormatter: TypeFormatter) {}

    public supportsType(type: BaseType): boolean {
        return type instanceof ArrayType;
    }
    public getDefinition(type: ArrayType, options?: GetDefinitionOptions): Definition {
        return {
            type: "array",
            items: this.childTypeFormatter.getDefinition(type.getItem(), options),
        };
    }
    public getChildren(type: ArrayType): BaseType[] {
        return this.childTypeFormatter.getChildren(type.getItem());
    }
}
