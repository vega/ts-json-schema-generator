type ImmutablePrimitive = undefined | null | boolean | string | number | ((...args: any[]) => any);
type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>;
type ImmutableSet<T> = ReadonlySet<Immutable<T>>;
type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> };

type Immutable<T> = T extends ImmutablePrimitive
    ? T
    : T extends Map<infer K, infer V>
      ? ImmutableMap<K, V>
      : T extends Set<infer M>
        ? ImmutableSet<M>
        : ImmutableObject<T>;

interface Bar {
    id: string;
    size: number;
}

export type MyType = {
    obj: Immutable<Bar>;
    arr: Immutable<Bar[]>;
    tuple: Immutable<[string, number]>;
};
