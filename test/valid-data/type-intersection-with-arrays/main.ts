export type NonEmptyNumberArrayVariationOne = [number, ...number[]] & number[];

type NonEmptyGenericArrayVariationOne<T> = [T, ...T[]] & T[];

export type NonEmptyNumberArrayVariationTwo = NonEmptyGenericArrayVariationOne<number>;
