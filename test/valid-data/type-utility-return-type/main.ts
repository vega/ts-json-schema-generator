function myFunction(a: string, b: number): { name: string; value: number } {
    return { name: a, value: b };
}

export type MyReturnType = ReturnType<typeof myFunction>;
