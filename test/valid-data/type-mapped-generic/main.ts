type PropFoo = 123;
type PropBar = "bar";

export interface SomeInterface {
    foo: PropFoo;
    bar: PropBar;
}
export type NullableAndPartial<T> = {
    [K in keyof T]?: T[K] | null;
};

export type MyObject = NullableAndPartial<SomeInterface>;
