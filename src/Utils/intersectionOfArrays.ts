import * as stringify from "json-stable-stringify";

export function intersectionOfArrays<T>(a: readonly T[], b: readonly T[]): T[] {
    const output: T[] = [];
    const inA: Set<string> = new Set(a.map((item: T) => stringify(item)));
    for (const value of b) {
        if (inA.has(stringify(value))) {
            output.push(value);
        }
    }
    return output;
}
