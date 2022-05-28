type NestedTuple = [{ a: number }, ...[{ b: string }, { c: number }, ...[{ d: boolean }, ...[]]]];

type ToUnion<T extends any[]> = T extends Array<infer A> ? A : never;

export type MyType = ToUnion<NestedTuple>;
