function myFunction(a: string, b: number) {
    return { a, b };
}

export type MyParameters = Parameters<typeof myFunction>;
