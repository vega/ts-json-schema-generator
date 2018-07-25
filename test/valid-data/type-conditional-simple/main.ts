// Basically the first example from
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    "object";

export type T0 = TypeName<string>;  // "string"
export type T1 = TypeName<"a">;  // "string"
export type T2 = TypeName<true>;  // "boolean"
export type T3 = TypeName<string[]>;  // "object"

export interface Usage {
    t0: T0,
    t1: T1,
    t2: T2,
    t3: T3
}
