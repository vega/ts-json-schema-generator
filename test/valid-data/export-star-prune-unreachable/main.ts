import type { Interface3 } from "./test-file-2";

export type MyType = string;

export interface MyObject extends Interface3 {
    foo: Record<string, string>;
}
