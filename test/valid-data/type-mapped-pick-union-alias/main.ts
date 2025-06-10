interface SomeInterface {
    a: number;
    b: string;
    c: boolean;
    d: string[];
    e: null;
}

type A = "a";
type B = "b";
type C = "c";
type D = "d";
type E = "e";

type AB = A | B;
type ABC = AB | C;
type ABCD = ABC | D;

export type PickAliasedLiteralUnion = Pick<SomeInterface, ABCD | E>;
