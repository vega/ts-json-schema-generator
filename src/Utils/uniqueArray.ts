export function uniqueArray<T>(array: readonly T[]): T[] {
    return array.reduce((result: T[], item: T) => {
        if (!result.includes(item)) {
            result.push(item);
        }

        return result;
    }, []);
}
