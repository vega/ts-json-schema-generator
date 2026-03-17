import type { JSONSchema7Definition } from "json-schema";
/**
 * Merges nested objects and arrays.
 *
 * @param a - lhs to merge.
 * @param b - rhs to merge.
 * @param intersectArrays - compute intersection of arrays (otherwise take the array from b).
 * @returns a and b merged together.
 */
export declare function deepMerge(a: {
    [key: string]: JSONSchema7Definition;
}, b: {
    [key: string]: JSONSchema7Definition;
}): {
    [x: string]: JSONSchema7Definition;
};
