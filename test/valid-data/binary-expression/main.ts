const foo = {
    numbers: 60 * 5,
    strings: "a" + "b",
    booleans: true && false,
    any: 1 + ("test" as any),
    threeNumbers: 60 * 5 + 1,
    mixedStringAndNumbers: 60 * 5 + " minutes",
} as const;

export type MyObject = typeof foo;
