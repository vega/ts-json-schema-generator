// type Index = "a" | "b" | "c";

// export interface MyInterface {
//     tooltip?: number;
//     // [k: string]?: number;
//     // [k in Index]?: number;
// }

export interface A {
    a: number;
}

export type B = Partial<A>;
