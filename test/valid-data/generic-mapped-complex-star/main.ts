export type Merge<A, B> = {
    [K in keyof A as K extends keyof B ? never : K]: A[K];
} & B;

export type Simplify<T> = {
    [K in keyof T]: T[K];
} & {};

export type OverrideSimple<A, B> = Simplify<Merge<A, B>>;

export type Base = {
    foo: string;
    bar: number;
};

export type MyType = OverrideSimple<
    Base,
    {
        bar: string;
        baz: boolean;
    }
>;
