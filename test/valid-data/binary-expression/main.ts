type StringUnion = "a" | "b";
type NumberUnion = 10 | 20;
type MixedUnion = "c" | 30;

function getAny(): any {
    return "test" as any;
}

function getBoolean(): boolean {
    return Math.random() > 0.5;
}

const anyString: any = getAny();

const aStringUnion: StringUnion = "a";
const bStringUnion: StringUnion = "b";

const tenNumberUnion: NumberUnion = 10;
const twentyNumberUnion: NumberUnion = 20;

const thirtyMixedUnion: MixedUnion = 30;

const a: boolean = true;
const b: boolean = getBoolean();

const foo = {
    numbers: 60 * 5,
    strings: "a" + "b",
    booleans: a || b,
    any: 1 + anyString,
    threeNumbers: 60 * 5 + 1,
    mixedStringAndNumbers: 60 * 5 + " minutes",
    bigintType: BigInt(123),

    stringUnion: aStringUnion + bStringUnion,
    numberUnion: tenNumberUnion + twentyNumberUnion,
    mixedUnion: thirtyMixedUnion + " is a number",
} as const;

export type MyObject = typeof foo;
