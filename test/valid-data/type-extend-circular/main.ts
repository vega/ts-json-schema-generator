export interface MyObject<T> {
    foo: MyObject<T>;
}

export interface MyType extends MyObject<number> {
    bar: string;
}
