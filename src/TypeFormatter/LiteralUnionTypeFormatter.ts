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
                preserveLiterals ||= t.getPreserveLiterals();
                return false;
            }

            if (t instanceof NullType) {
                hasNull = true;
                return true;
            }

            if (t instanceof LiteralType && !t.isString()) {
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
            if (type instanceof EnumType) {
                for (const value of type.getValues()) {
                    typeValues.add(value);
                    typeNames.add(typeName(value));
                }

                continue;
            }

            if (type instanceof LiteralType) {
                typeValues.add(type.getValue());
                typeNames.add(typeName(type.getValue()));
                continue;
            }

            typeValues.add(null);
            typeNames.add("null");
        }

        const schema = {
            type: typeNames.size === 1 ? typeNames.values().next().value : Array.from(typeNames),
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
