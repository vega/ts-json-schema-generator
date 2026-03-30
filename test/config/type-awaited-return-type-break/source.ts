type ImmutablePrimitive = undefined | null | boolean | string | number | ((...args: any[]) => any);
type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> };

export type Immutable<T> = T extends ImmutablePrimitive
    ? T
    : T extends Map<infer K, infer V>
      ? ReadonlyMap<Immutable<K>, Immutable<V>>
      : ImmutableObject<T>;

export interface Bar {
    id: string;
    size: number;
    boost: boolean;
    geo: [number, number];
}

export type MyType = Immutable<Bar>;
