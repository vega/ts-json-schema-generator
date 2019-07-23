export function uniqueArrayWithHash<T>(values: T[], f: (item: T) => string | number): T[] {
    const results: T[] = [];
    const u = new Set();
    let v: string | number;
    for (const val of values) {
        v = f(val);
        if (u.has(v)) {
            continue;
        }
        u.add(v);
        results.push(val);
    }
    return results;
}
