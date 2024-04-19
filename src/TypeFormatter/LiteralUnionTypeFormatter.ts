import { Definition } from "../Schema/Definition.js";
import { RawTypeName } from "../Schema/RawType.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { LiteralType } from "../Type/LiteralType.js";
import { NullType } from "../Type/NullType.js";
import { StringType } from "../Type/StringType.js";
import { UnionType } from "../Type/UnionType.js";
import { typeName } from "../Utils/typeName.js";
import { uniqueArray } from "../Utils/uniqueArray.js";

export class LiteralUnionTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof UnionType && type.getTypes().length > 0 && this.isLiteralUnion(type);
    }
    public getDefinition(type: UnionType): Definition {
        let hasString = false;
        const types = type.getTypes().filter((t) => {
            const isString = t instanceof StringType;
            hasString = hasString || isString;
            return !isString;
        });

        if (hasString) {
            return {
                type: "string",
            };
        }

        const values = uniqueArray(
            types.map((item: LiteralType | NullType | StringType) => this.getLiteralValue(item)),
        );
        const typeNames = uniqueArray(
            types.map((item: LiteralType | NullType | StringType) => this.getLiteralType(item)),
        );

        return {
            type: typeNames.length === 1 ? typeNames[0] : typeNames,
            enum: values,
        };
    }
    public getChildren(type: UnionType): BaseType[] {
        return [];
    }

    protected isLiteralUnion(type: UnionType): boolean {
        return type
            .getTypes()
            .every((item) => item instanceof LiteralType || item instanceof NullType || item instanceof StringType);
    }
    protected getLiteralValue(value: LiteralType | NullType): string | number | boolean | null {
        return value instanceof LiteralType ? value.getValue() : null;
    }
    protected getLiteralType(value: LiteralType | NullType): RawTypeName {
        return value instanceof LiteralType ? typeName(value.getValue()) : "null";
    }
}
