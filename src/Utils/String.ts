const quotes = new Set([ "'", '"' ]);

export function strip(input: string, chars: Set<string> = quotes): string {
    const length = input.length;
    const start = input.charAt(0);
    const end = input.charAt(length - 1);
    if (length >= 2 && start === end && chars.has(start)) {
        return input.substring(1, length - 1);
    }
    return input;
}
