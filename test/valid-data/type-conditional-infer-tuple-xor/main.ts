type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};

type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

type TupleXOR<T extends any[]> = T extends [infer Only]
    ? Only
    : T extends [infer A, infer B, ...infer Rest]
    ? TupleXOR<[XOR<A, B>, ...Rest]>
    : never;

export type MyType = TupleXOR<[{ a: string }, { b: number }, { c: boolean }]>;
