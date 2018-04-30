export interface Test {
    a: number;
    b: string;
    c: number;
}

export declare type OneOf<T> = {
    [K in keyof T]: Pick<T, K>;
}[keyof T];

export interface MyObject {
    blah: OneOf<Test>;
}