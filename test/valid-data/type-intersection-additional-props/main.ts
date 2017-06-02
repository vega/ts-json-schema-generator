export interface A {
    bar: number;
}

export interface B {
    [index: string]: number | string;
}

export interface C {
    [index: string]: A | number;
}

export interface MyObject {
    value: A & B & C;
}
