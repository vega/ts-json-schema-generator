import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { EnumType } from "../Type/EnumType";
import { typeName } from "../Utils/typeName";
import { uniqueArray } from "../Utils/uniqueArray";

export class EnumTypeFormatter implements SubTypeFormatter {
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
        return values.length === 1
            ? { type: types[0], const: values[0] }
            : { type: types.length === 1 ? types[0] : types, enum: values };
    }
    public getChildren(type: EnumType): BaseType[] {
        return [];
    }
}
