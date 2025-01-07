import type { Definition } from "../Schema/Definition.js";
import type { RawTypeName } from "../Schema/RawType.js";
import type { SubTypeFormatter } from "../SubTypeFormatter.js";
import type { BaseType } from "../Type/BaseType.js";
import { EnumType } from "../Type/EnumType.js";
import { LiteralType, type LiteralValue } from "../Type/LiteralType.js";
import { NullType } from "../Type/NullType.js";
import { StringType } from "../Type/StringType.js";
import { UnionType } from "../Type/UnionType.js";
import { typeName } from "../Utils/typeName.js";
import { toEnumType } from "./EnumTypeFormatter.js";

export class LiteralUnionTypeFormatter implements SubTypeFormatter {
    public supportsType(type: BaseType): boolean {
        return type instanceof UnionType && type.getTypes().length > 0 && isLiteralUnion(type);
    }

    public getDefinition(unionType: UnionType): Definition {
        let hasString = false;
        let preserveLiterals = false;
        let allStrings = true;
        let hasNull = false;

        const literals = unionType.getFlattenedTypes();

        // filter out String types since we need to be more careful about them
        const types = literals.filter((literal) => {
            if (literal instanceof StringType) {
                hasString = true;
                preserveLiterals ||= literal.getPreserveLiterals();
                return false;
            }

            if (literal instanceof NullType) {
                hasNull = true;
                return true;
            }

            if (literal instanceof LiteralType && !literal.isString()) {
                allStrings = false;
            }

            return true;
        });

        if (allStrings && hasString && !preserveLiterals) {
            return hasNull ? { type: ["string", "null"] } : { type: "string" };
        }

        const typeValues: Set<LiteralValue | null> = new Set();
        const typeNames: Set<RawTypeName> = new Set();

        for (const type of types) {
            appendTypeNames(type, typeNames);
            appendTypeValues(type, typeValues);
        }

        const schema = {
            type: toEnumType(Array.from(typeNames)),
            enum: Array.from(typeValues),
        };

        return preserveLiterals ? { anyOf: [{ type: "string" }, schema] } : schema;
    }

    public getChildren(): BaseType[] {
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

/**
 * Appends all possible type names of a type to the given set.
 */
function appendTypeNames(type: BaseType, names: Set<RawTypeName>) {
    if (type instanceof EnumType) {
        for (const value of type.getValues()) {
            names.add(typeName(value));
        }

        return;
    }

    if (type instanceof LiteralType) {
        names.add(typeName(type.getValue()));
        return;
    }

    names.add(typeName(null));
}

/**
 * Appends all possible values of a type to the given set.
 */
function appendTypeValues(type: BaseType, values: Set<LiteralValue | null>) {
    if (type instanceof EnumType) {
        for (const value of type.getValues()) {
            values.add(value);
        }

        return;
    }

    if (type instanceof LiteralType) {
        values.add(type.getValue());
        return;
    }

    values.add(null);
}
