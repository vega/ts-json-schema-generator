export interface NumericIndexBase {
    [n: number]: { a: string };
}

export interface MyObject extends NumericIndexBase {
    [n: number]: { a: string; b: string };
}
