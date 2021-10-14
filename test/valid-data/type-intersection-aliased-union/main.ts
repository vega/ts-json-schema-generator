export interface A1 {
    a1: number;
}

export interface A2 {
    a2: number;
}

export type A = A1 | A2;

export interface B {
    b: number;
}

export interface C {
    c: number;
}

export type MyObject = (A | B) & C;
