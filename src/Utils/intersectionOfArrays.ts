import stringify from "safe-stable-stringify";

export function intersectionOfArrays<T>(a: T[], b: T[]): T[] {
    const output: T[] = [];
    const inA: Set<string> = new Set(a.map((item: T) => stringify(item!)));
    for (const value of b) {
        if (inA.has(stringify(value!))) {
            output.push(value);
        }
    }
    return output;
}
