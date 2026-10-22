export interface A {
    a: string;
}

export interface B extends A {
    b: string;
}

export interface Base {
    [n: number]: A;
}

export interface MyObject extends Base {
    [n: number]: B;
}
