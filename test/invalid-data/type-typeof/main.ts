export namespace Types {
    export const STRING: string = "s";
    export const NUMBER: number = 1;
}

export type MyType = typeof Types.STRING | typeof Types.NUMBER;
