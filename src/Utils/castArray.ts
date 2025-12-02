export function castArray<T>(input: undefined | T | T[]): undefined | T[] {
    if (input === undefined) {
        return undefined;
    }

    return Array.isArray(input) ? input : [input];
}
