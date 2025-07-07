type OptionalKeys<TBase> = {
    [K in keyof TBase]-?: {} extends Pick<TBase, K> ? K : never;
}[keyof TBase];

type Override<TBase, TOverride extends { [K in keyof TOverride]: K extends keyof TBase ? unknown : never }> = {
    [K in keyof TBase as K extends keyof TOverride ? never : K]: TBase[K]; // keep everything except overrides
} & {
    [K in keyof TOverride]: K extends keyof TBase
        ? K extends OptionalKeys<TBase> // preserve optionality
            ? TOverride[K] | undefined
            : TOverride[K]
        : never;
};

interface Base {
    foo: string;
    bar: null;
}

export type MyObject = Override<Base, { bar: number }>;
