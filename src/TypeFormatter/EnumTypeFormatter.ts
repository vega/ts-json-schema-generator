import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { EnumType } from "../Type/EnumType";
import { typeName } from "../Utils/typeName";
import { uniqueArray } from "../Utils/uniqueArray";

export class EnumTypeFormatter implements SubTypeFormatter {
    public supportsType(type: EnumType): boolean {
        return type instanceof EnumType;
    }
    public getDefinition(type: EnumType): Definition {
        const values = uniqueArray(type.getValues());
        const types = uniqueArray(values.map(typeName));
        const isSingle = values.length === 1;

        return {
            type: types.length === 1 ? types[0] : types,
            [isSingle ? 'const' : 'enum']: isSingle ? values[0] : values,
        };
    }
    public getChildren(type: EnumType): BaseType[] {
        return [];
    }
}
