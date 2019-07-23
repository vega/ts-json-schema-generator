export interface Type {
    value: "foo" | "bar";
}

export interface MyObject extends Type {
    value: "foo";
}
