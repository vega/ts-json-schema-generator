// types are from https://github.com/sindresorhus/type-fest

export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

export type PickIndexSignature<ObjectType> = {
    [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown> ? KeyType : never]: ObjectType[KeyType];
};

export type OmitIndexSignature<ObjectType> = {
    [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown> ? never : KeyType]: ObjectType[KeyType];
};

type SimpleMerge<Destination, Source> = {
    [Key in keyof Destination as Key extends keyof Source ? never : Key]: Destination[Key];
} & Source;

export type Merge<Destination, Source> = Simplify<
    SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>> &
        SimpleMerge<OmitIndexSignature<Destination>, OmitIndexSignature<Source>>
>;

export type OverrideProperties<
    TOriginal,
    TOverride extends Partial<Record<keyof TOriginal, unknown>> & {
        [Key in keyof TOverride]: Key extends keyof TOriginal ? TOverride[Key] : never;
    },
> = Merge<TOriginal, TOverride>;
