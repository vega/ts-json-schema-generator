const quotes = [ "'", '"' ];

export function strip(input: string, chars: string[] = quotes): string {
    const length = input.length;
    const start = input.charAt(0);
    const end = input.charAt(length - 1);
    for(const char of chars) {
        if (start === char && end === char) {
            return input.substr(1, length - 2);
        }
    }
    return input;
}
