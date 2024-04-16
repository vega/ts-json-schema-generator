import { Definition } from "../Schema/Definition.js";
import { RawTypeName } from "../Schema/RawType.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { NullType } from "../Type/NullType.js";
import { UnionType } from "../Type/UnionType.js";
import { typeName } from "../Utils/typeName.js";
import { uniqueArray } from "../Utils/uniqueArray.js";

export class LiteralUnionTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof UnionType && type.getTypes().length > 0 && this.isLiteralUnion(type);
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

    protected isLiteralUnion(type: UnionType): boolean {
        return type.getTypes().every((item) => item instanceof LiteralType || item instanceof NullType);
    }
    protected getLiteralValue(value: LiteralType | NullType): string | number | boolean | null {
        return value instanceof LiteralType ? value.getValue() : null;
    }
    protected getLiteralType(value: LiteralType | NullType): RawTypeName {
        return value instanceof LiteralType ? typeName(value.getValue()) : "null";
    }
}
