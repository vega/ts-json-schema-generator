interface Base {
    foo: string;
    bar: null;
    [key: string]: any;
}

type Keep<B, K> = { [P in Exclude<keyof B, K>]: B[P] };

type Override<B, O extends Partial<Record<keyof B, any>>> = Keep<B, keyof O> & O;

export type MyObject = Override<Base, { bar: number }>;
