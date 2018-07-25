interface SomeInterface {
    foo: 12;
}

export type MyType = keyof SomeInterface;
