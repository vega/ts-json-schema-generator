import * as stringify from "json-stable-stringify";
import { uniqueArrayWithHash } from "./uniqueArrayWithHash";
import { intersectionOfArrays } from "./intersectionOfArrays";

export function deepMerge<T>(a: Partial<T>, b: Partial<T>, intersectArrays: boolean): T;
export function deepMerge<A, B>(a: A, b: B, intersectArrays: boolean): A & B | B;
/**
 * Merges nested objects and arrays.
 *
 * @param a - lhs to merge.
 * @param b - rhs to merge.
 * @param intersectArrays - compute intersection of arrays (otherwise take the array from b).
 * @returns a and b merged together.
 */
export function deepMerge(a: any, b: any, intersectArrays: boolean): any {
    const typeA = typeof a;
    const typeB = typeof b;
    if (typeA === typeB && typeA === "object" && typeA !== null && a !== b) {
        const isArrayA = Array.isArray(a);
        const isArrayB = Array.isArray(b);
        // If they are both arrays just concatenate them.
        if (isArrayA && isArrayB) {
            if (intersectArrays) {
                return uniqueArrayWithHash(intersectionOfArrays(a, b), stringify);
            } else {
                return b;
            }
        } else if ((isArrayA && !isArrayB) || (!isArrayA && isArrayB)) {
            return b;
        } else {
            // make a shallow copy of a.
            const output = Object.assign({}, a);
            // deep merge all properties in both.
            for (const key in output) {
                if (b.hasOwnProperty(key)) {
                    output[key] = deepMerge(a[key], b[key], intersectArrays);
                }
            }
            // add properties from b that are not in a.
            for (const key in b) {
                if (!a.hasOwnProperty(key)) {
                    output[key] = b[key];
                }
            }
            return output;
        }
    }
    // by default return b for non mergable types.
    return b;
}
