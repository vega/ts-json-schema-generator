export interface MyObject {
    foo: MyObject;
}

export interface MyType extends MyObject {
    bar: string;
}
