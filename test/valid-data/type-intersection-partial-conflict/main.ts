export interface Base {
    a: "hello" | "world";
}

export interface Base2 {
    a: "hello" | "typescript";
}

export type MyType = Base & Base2;
