interface SomeInterface {
    foo: 12;
    bar?: "baz";
}

export type MyType = keyof SomeInterface;
