type Foo = {
    foo: "a" | "b";
};

export type A = Foo & {
    foo: "a";
};

export type B = Foo & {
    foo: "b";
};

export type MyType = A | B;
