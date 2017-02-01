import { SubTypeFormatter } from "../SubTypeFormatter";
import { EnumType, EnumValue } from "../Type/EnumType";
import { BaseType } from "../Type/BaseType";
import { Definition } from "../Schema/Definition";
import { uniqueArray } from "../Utils/uniqueArray";

export class EnumTypeFormatter implements SubTypeFormatter {
    public supportsType(type: EnumType): boolean {
        return type instanceof EnumType;
    }
    public getDefinition(type: EnumType): Definition {
        const values: EnumValue[] = uniqueArray(type.getValues());
        const types: string[] = uniqueArray(values.map((value: EnumValue) => this.getValueType(value)));

        if (types.length === 1) {
            return {
                type: types[0],
                enum: values,
            };
        } else {
            return {
                type: types,
                enum: values,
            };
        }
    }
    public getChildren(type: EnumType): BaseType[] {
        return [];
    }

    private getValueType(value: EnumValue): string {
        return value === null ? "null" : typeof value;
    }
}
