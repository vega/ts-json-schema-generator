import type { SomeInterface } from "./dep";

export type MyType = string;

export interface MyObject extends SomeInterface {
    bar?: number;
}
