import { Definition } from "../Schema/Definition";
import { RawTypeName } from "../Schema/RawType";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";
import { NullType } from "../Type/NullType";
import { UnionType } from "../Type/UnionType";
import { typeName } from "../Utils/typeName";
import { uniqueArray } from "../Utils/uniqueArray";

export class LiteralUnionTypeFormatter implements SubTypeFormatter {
    public supportsType(type: UnionType): boolean {
        return (
            type instanceof UnionType &&
            type.getTypes().length > 0 &&
            this.isLiteralUnion(type)
        );
    }
    public getDefinition(type: UnionType): Definition {
        const values = uniqueArray(type.getTypes().map((item: LiteralType | NullType) => this.getLiteralValue(item)));
        const types = uniqueArray(type.getTypes().map((item: LiteralType | NullType) => this.getLiteralType(item)));

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
    public getChildren(type: UnionType): BaseType[] {
        return [];
    }

    private isLiteralUnion(type: UnionType): boolean {
        return type.getTypes().every((item) => item instanceof LiteralType || item instanceof NullType);
    }
    private getLiteralValue(value: LiteralType | NullType): string | number | boolean | null {
        return value instanceof LiteralType ? value.getValue() : null;
    }
    private getLiteralType(value: LiteralType | NullType): RawTypeName {
        return value instanceof LiteralType ? typeName(value.getValue()) : "null";
    }
}
