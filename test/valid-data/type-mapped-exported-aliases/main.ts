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

// Export the aliases individually to verify they're handled correctly
export type AB = A | B;
export type ABC = AB | C;
export type ABCD = ABC | D;

export type ABCDE = Pick<SomeInterface, ABCD | "e">;
