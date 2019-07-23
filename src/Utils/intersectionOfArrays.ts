export function intersectionOfArrays<T>(a: T[], b: T[]): T[] {
    const output: T[] = [];
    const inA: Map<T, boolean> = new Map<T, boolean>();
    for (const value of a) {
        inA.set(value, true);
    }
    for (const value of b) {
        if (inA.get(value)) {
            output.push(value);
        }
    }
    return output;
}
