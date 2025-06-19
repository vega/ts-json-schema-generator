import type { SomeInterface } from "./dep";
export { DepType } from "./dep";
export { DepType2 } from "./dep2";

export type MyType = string;

export interface MyObject extends SomeInterface {
    bar?: number;
}
