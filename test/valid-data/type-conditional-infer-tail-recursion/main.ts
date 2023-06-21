type GetFirst<T> = T extends [infer A, any] ? A : never;
type GetSecond<T> = T extends [any, infer A] ? A : never;

type Augment<T extends [string, any]> = { [K in GetFirst<T>]: GetSecond<T> };

type TailRecursion<T extends any[]> = T extends [infer Head, ...infer Tail]
    ? Head extends [string, any]
        ? [Augment<Head>, ...TailRecursion<Tail>]
        : never
    : [];

export type MyType = TailRecursion<[["a", string], ["b", number], ["c", boolean]]>;
