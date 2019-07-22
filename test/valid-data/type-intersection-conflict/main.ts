interface A {
    flag: boolean;
}

interface B {
    flag: true;
}

export type MyObject = A & B;
