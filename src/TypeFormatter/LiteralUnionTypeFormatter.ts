import { Definition } from "../Schema/Definition.js";
import { RawTypeName } from "../Schema/RawType.js";
import { SubTypeFormatter } from "../SubTypeFormatter.js";
import { BaseType } from "../Type/BaseType.js";
import { LiteralType, LiteralValue } from "../Type/LiteralType.js";
import { NullType } from "../Type/NullType.js";
import { StringType } from "../Type/StringType.js";
import { UnionType } from "../Type/UnionType.js";
import { derefAliasedType, isHiddenType } from "../Utils/derefType.js";
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

        const flattenedTypes = flattenTypes(type);

        // filter out String types since we need to be more careful about them
        const types = flattenedTypes.filter((t) => {
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

        const values = uniqueArray(types.map(getLiteralValue));
        const typeNames = uniqueArray(types.map(getLiteralType));

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

function flattenTypes(type: UnionType): (StringType | LiteralType | NullType)[] {
    return type
        .getTypes()
        .filter((t) => !isHiddenType(t))
        .map(derefAliasedType)
        .flatMap((t) => {
            if (t instanceof UnionType) {
                return flattenTypes(t);
            }
            return t as StringType | LiteralType | NullType;
        });
}

export function isLiteralUnion(type: UnionType): boolean {
    return flattenTypes(type).every(
        (item) => item instanceof LiteralType || item instanceof NullType || item instanceof StringType,
    );
}

function getLiteralValue(value: LiteralType | NullType): LiteralValue | null {
    return value instanceof LiteralType ? value.getValue() : null;
}

function getLiteralType(value: LiteralType | NullType): RawTypeName {
    return value instanceof LiteralType ? typeName(value.getValue()) : "null";
}
