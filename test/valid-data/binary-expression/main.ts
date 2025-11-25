type StringUnion = "a" | "b";
type NumberUnion = 10 | 20;
type MixedUnion = "c" | 30;

const foo = {
    numbers: 60 * 5,
    strings: "a" + "b",
    booleans: true && false,
    any: 1 + ("test" as any),
    threeNumbers: 60 * 5 + 1,
    mixedStringAndNumbers: 60 * 5 + " minutes",
    bigintType: BigInt(123),

    stringUnion: ("a" as StringUnion) + ("b" as StringUnion),
    numberUnion: (10 as NumberUnion) + (20 as NumberUnion),
    mixedUnion: (30 as MixedUnion) + " is a number",
} as const;

export type MyObject = typeof foo;
