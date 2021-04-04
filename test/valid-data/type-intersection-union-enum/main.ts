export type type1 = "foo" | "bar";
export type type2 = type1 | "baz";

export type MyObject = {
    field1: type1;
    field2: type2;
};
