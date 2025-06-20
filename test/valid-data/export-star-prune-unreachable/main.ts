import type { SomeInterface } from "./dep";
export { DepType } from "./dep";
export * from "./dep2";

export type MyType = string;

export interface MyObject extends SomeInterface {
    bar?: number;
    baz?: Internal;
}

interface Internal {
    nested?: boolean;
}
