export interface A {
    a: string;
}

export interface B {
    b: string;
}

export interface C {
    c: A | B;
}

export interface D {
    d: string;
}

type MakeOptional<T> = {
    [P in keyof T]?: T[P];
};

export type MyObject = MakeOptional<C> & D;
