export function uniqueArray<T>(array: readonly T[]): T[] {
    return array.reduce((result: T[], item: T) => {
        if (result.indexOf(item) < 0) {
            result.push(item);
        }

        return result;
    }, []);
}
