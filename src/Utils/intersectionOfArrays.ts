export function intersectionOfArrays<T>(a: T[], b: T[]): T[] {
    const output: T[] = [];
    const inA: Set<T> = new Set(a);
    for (const value of b) {
        if (inA.has(value)) {
            output.push(value);
        }
    }
    return output;
}
