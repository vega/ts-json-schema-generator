export interface X {
    foo: number;
}

export interface A {
    a: X | number;
}

export interface B {
    a: X;
}

export type MyType = A & B;
