import { JSONSchema7Definition } from "json-schema";
import { Definition } from "../Schema/Definition.js";
import { RawType } from "../Schema/RawType.js";
import { intersectionOfArrays } from "./intersectionOfArrays.js";

/**
 * Merges nested objects and arrays.
 *
 * @param a - lhs to merge.
 * @param b - rhs to merge.
 * @param intersectArrays - compute intersection of arrays (otherwise take the array from b).
 * @returns a and b merged together.
 */
export function deepMerge(
    a: { [key: string]: JSONSchema7Definition },
    b: { [key: string]: JSONSchema7Definition }
): { [x: string]: JSONSchema7Definition } {
    const output = { ...structuredClone(a), ...structuredClone(b) };

    for (const key in a) {
        if (b.hasOwnProperty(key)) {
            const elementA = a[key as keyof Definition];
            const elementB = b[key as keyof Definition];

            if (
                elementA != null &&
                elementB != null &&
                typeof elementA === "object" &&
                typeof elementB === "object" &&
                "type" in elementA &&
                "type" in elementB
            ) {
                if (elementA.type == elementB.type) {
                    const enums = mergeConstsAndEnums(elementA, elementB);
                    if (enums != null) {
                        const isSingle = enums.length === 1;
                        (output as any)[key][isSingle ? "const" : "enum"] = isSingle ? enums[0] : enums;
                        delete (output as any)[key][isSingle ? "enum" : "const"];
                    }
                }
            }
        }
    }

    return output;
}

function mergeConstsAndEnums(a: Definition, b: Definition): RawType[] | undefined {
    // NOTE: const is basically a syntactic sugar for an enum with a single element.
    const enumA = a.const !== undefined ? [a.const] : a.enum;
    const enumB = b.const !== undefined ? [b.const] : b.enum;

    if (enumA == null && enumB != null) {
        return enumB;
    } else if (enumA != null && enumB == null) {
        return enumA;
    } else if (enumA != null && enumB != null) {
        return intersectionOfArrays(enumA, enumB);
    } else {
        return undefined;
    }
}
