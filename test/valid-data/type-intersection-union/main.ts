export interface A {
    a: number;
}

export interface B {
    b: number;
}

export interface C {
    c: number;
}

export interface D {
    d: number;
}

export interface E {
    e: number;
}

export type MyObject = (B | C) & A & (D | E);
