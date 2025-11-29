type StringUnion = "a" | "b";
type NumberUnion = 10 | 20;
type MixedUnion = "c" | 30;

function getAny(): any {
    return "test" as any;
}

function getBoolean(): boolean {
    return Math.random() > 0.5;
}

function getStringUnion(): StringUnion {
    return Math.random() > 0.5 ? "a" : "b";
}

function getNumberUnion(): NumberUnion {
    return Math.random() > 0.5 ? 10 : 20;
}

function getMixedUnion(): MixedUnion {
    return Math.random() > 0.5 ? "c" : 30;
}

function getUnknown(): unknown {
    return "unknown value";
}

function getStringType(): string {
    return Math.random() > 0.5 ? "hello" : "world";
}

const anyString: any = getAny();

const aStringUnion: StringUnion = getStringUnion();
const bStringUnion: StringUnion = getStringUnion();

const tenNumberUnion: NumberUnion = getNumberUnion();
const twentyNumberUnion: NumberUnion = getNumberUnion();

const thirtyMixedUnion: MixedUnion = getMixedUnion();

const a: boolean = getBoolean();
const b: boolean = getBoolean();

const unknownValue: unknown = getUnknown();

const foo = {
    numbers: 60 * 5,
    stringLiterals: "a" + "b",
    stringTypes: getStringType() + getStringType(),
    booleanTypes: a || b,
    booleanLiterals: true || false,
    any: 1 + anyString,
    threeNumbers: 60 * 5 + 1,
    mixedStringAndNumbers: 60 * 5 + " minutes",
    bigintType: BigInt(123),

    unknowns: unknownValue && unknownValue,

    stringUnion: aStringUnion + bStringUnion,
    numberUnion: tenNumberUnion + twentyNumberUnion,
    mixedUnion: thirtyMixedUnion + " is a number",
} as const;

export type MyObject = typeof foo;
