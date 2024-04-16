enum MyEnum {
    A = "a",
    B = "b",
}

export type MyObject = {
    prop?: `${MyEnum}`;
}
