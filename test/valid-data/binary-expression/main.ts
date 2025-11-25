const foo = {
    numbers: 60 * 5,
    threeNumbers: 60 * 5 + 1,
    strings: "a" + "b",
    booleans: true && false,
    any: 1 + ("test" as any),
} as const;

export type MyObject = typeof foo;
