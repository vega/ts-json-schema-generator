export interface A {
    [n: number]: A;
}

export interface B extends A {
    [n: number]: A;
}
