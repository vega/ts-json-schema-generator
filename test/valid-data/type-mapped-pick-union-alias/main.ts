interface SomeInterface {
    foo: string;
    bar: number;
}

type KeyFoo = "foo";
type KeyBar = "bar";

export type PickAliasedLiteralUnion = Pick<SomeInterface, KeyFoo | KeyBar>;
