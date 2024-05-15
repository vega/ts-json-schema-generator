enum FromZero {
    a,
    b,
    c,
}

enum SomeCustomInitializers {
    a = 10,
    b,
    c = 20,
    d,
}

enum StringEnum {
    a = "foo",
    b = "bar",
}

enum MixedEnum {
    a,
    b = 10,
    c,
    d = "foo",
}

export type MyObject = {
    fromZero: typeof FromZero;
    someCustomInitializers: typeof SomeCustomInitializers;
    stringEnum: typeof StringEnum;
    mixedEnum: typeof MixedEnum;
};
