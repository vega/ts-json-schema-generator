import { JSONSchema7Definition } from "json-schema";
import { Definition } from "../Schema/Definition";
import { intersectionOfArrays } from "./intersectionOfArrays";

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
    const output = { ...a, ...b };

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
                    if (elementA.enum == null && elementB.enum != null) {
                        (output as any)[key].enum = elementB.enum;
                    } else if (elementA.enum != null && elementB.enum == null) {
                        (output as any)[key].enum = elementA.enum;
                    } else if (elementA.enum != null && elementB.enum != null) {
                        (output as any)[key].enum = intersectionOfArrays(
                            elementA.enum as any[],
                            elementB.enum as any[]
                        );
                    }
                }
            }
        }
    }

    return output;
}
