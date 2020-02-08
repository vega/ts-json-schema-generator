export function notUndefined<T>(x: T | undefined): x is T {
    return x !== undefined;
}
