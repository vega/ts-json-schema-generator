export interface A {
    a: string;
}

export interface B extends A {
    b: string;
}

export interface Base {
    [n: number]: A;
}

export interface Mid extends Base {}

export interface MyObject extends Mid {
    [n: number]: B;
}
