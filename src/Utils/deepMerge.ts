export function deepMerge<T>(a: Partial<T>, b: Partial<T>): T;
export function deepMerge<A, B>(a: A, b: B): A & B | B;
/**
 * Merges nested objects and arrays.
 *
 * @param a - lhs to merge.
 * @param b - rhs to merge.
 * @returns a and b merged together.
 */
export function deepMerge(a: any, b: any): any {
    const typeA = typeof a;
    const typeB = typeof b;
    if (typeA === typeB && typeA === "object" && typeA !== null && a !== b) {
        const isArrayA = Array.isArray(a);
        const isArrayB = Array.isArray(b);
        // If they are both arrays just concatenate them.
        if (isArrayA && isArrayB) {
            return a.concat(b);
        } else if ((isArrayA && !isArrayB) || (!isArrayA && isArrayB)) {
            return b;
        } else {
            // make a copy of a.
            const output = Object.assign({}, a);
            // deep merge all properties in both.
            for (const key in output) {
                if (b.hasOwnProperty(key)) {
                    output[key] = deepMerge(a[key], b[key]);
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
