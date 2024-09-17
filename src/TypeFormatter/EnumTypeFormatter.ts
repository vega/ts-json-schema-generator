import { Definition } from "../Schema/Definition.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { EnumType } from "../Type/EnumType.js";
import { typeName } from "../Utils/typeName.js";
import { uniqueArray } from "../Utils/uniqueArray.js";

export class EnumTypeFormatter implements SubTypeFormatter {
    public constructor(
        protected constAsEnum: boolean
    ) {}

    public supportsType(type: BaseType): boolean {
        return type instanceof EnumType;
    }
    public getDefinition(type: EnumType): Definition {
        const values = uniqueArray(type.getValues());
        const types = uniqueArray(values.map(typeName));

        // NOTE: We want to use "const" when referencing an enum member.
        // However, this formatter is used both for enum members and enum types,
        // so the side effect is that an enum type that contains just a single
        // value is represented as "const" too.
        return values.length === 1 && !this.constAsEnum
            ? { type: types[0], const: values[0] }
            : { type: types.length === 1 ? types[0] : types, enum: values };
    }
    public getChildren(type: EnumType): BaseType[] {
        return [];
    }
}