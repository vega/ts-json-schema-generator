import { Definition } from "../Schema/Definition.js";
import { RawTypeName } from "../Schema/RawType.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { EnumType } from "../Type/EnumType.js";
import { LiteralType, LiteralValue } from "../Type/LiteralType.js";
import { NullType } from "../Type/NullType.js";
import { StringType } from "../Type/StringType.js";
import { UnionType } from "../Type/UnionType.js";
import { typeName } from "../Utils/typeName.js";
import { uniqueArray } from "../Utils/uniqueArray.js";

export class LiteralUnionTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof UnionType && type.getTypes().length > 0 && isLiteralUnion(type);
    }
    public getDefinition(type: UnionType): Definition {
        let hasString = false;
        let preserveLiterals = false;
        let allStrings = true;
        let hasNull = false;

        const literals = type.getFlattenedTypes();

        // filter out String types since we need to be more careful about them
        const types = literals.filter((t) => {
            if (t instanceof StringType) {
                hasString = true;
                preserveLiterals = preserveLiterals || t.getPreserveLiterals();
                return false;
            } else if (t instanceof NullType) {
                hasNull = true;
                return true;
            } else if (t instanceof LiteralType && !t.isString()) {
                allStrings = false;
            }

            return true;
        });

        if (allStrings && hasString && !preserveLiterals) {
            return {
                type: hasNull ? ["string", "null"] : "string",
            };
        }

        const values = uniqueArray(types.flatMap(getLiteralValues));
        const typeNames = uniqueArray(types.flatMap(getLiteralTypes));

        const ret = {
            type: typeNames.length === 1 ? typeNames[0] : typeNames,
            enum: values,
        };

        if (preserveLiterals) {
            return {
                anyOf: [
                    {
                        type: "string",
                    },
                    ret,
                ],
            };
        }

        return ret;
    }
    public getChildren(type: UnionType): BaseType[] {
        return [];
    }
}

export function isLiteralUnion(type: UnionType): boolean {
    return type
        .getFlattenedTypes()
        .every(
            (item) =>
                item instanceof LiteralType ||
                item instanceof NullType ||
                item instanceof StringType ||
                item instanceof EnumType,
        );
}

function getLiteralValues(value: LiteralType | EnumType | NullType): readonly (LiteralValue | null)[] {
    if (value instanceof EnumType) {
        return value.getValues();
    } else if (value instanceof LiteralType) {
        return [value.getValue()];
    }
    return [null];
}

function getLiteralTypes(value: LiteralType | EnumType | NullType): RawTypeName[] {
    if (value instanceof EnumType) {
        return value.getValues().map(typeName);
    } else if (value instanceof LiteralType) {
        return [typeName(value.getValue())];
    }
    return ["null"];
}
