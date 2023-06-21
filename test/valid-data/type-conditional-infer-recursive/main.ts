type Recursive<T> = T extends Array<infer A> ? Recursive<A> : T;

export type MyType = Recursive<[[[string], [number, { a: string }]], [[boolean]]]>;
