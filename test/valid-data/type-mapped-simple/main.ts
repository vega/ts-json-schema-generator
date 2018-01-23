interface SomeInterface {
    foo: 12;
    bar: "baz";
}

export type MyObject = {
    [K in keyof SomeInterface]?: boolean;
};
