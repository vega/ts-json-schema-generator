
export interface MyInterface {
    a: number,
    b: string
}

export type OneOf<T> = {[K in keyof T]: Pick<T, K>}[keyof T];

export type MyObject = OneOf<MyInterface>
