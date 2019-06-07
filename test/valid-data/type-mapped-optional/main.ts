interface SomeInterface {
    foo?: 123;
    bar: "baz";
}

export type MyObject = {
    [K in keyof SomeInterface]: SomeInterface[K];
};
