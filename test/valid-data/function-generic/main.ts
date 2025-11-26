function fn<A, B, C>(a: A, b: B, c: C, any: A | B | C) {
    return { a, b, c, any };
}

const value = {
    litNum: fn(1, "2", true, 1),
    litStr: fn("1", 2, true, "2"),
    litBool: fn(true, 2, "3", true),
    obj: fn({ a: 1 }, { b: "2" }, { c: true }, { a: 1 }),
};

export type MyType = typeof value;
