interface BaseA {
    foo: string;
    [key: string]: any;
}

type Keep<B> = { [K in keyof B]: B[K] };

export type MyObjectA = Keep<BaseA>;

interface BaseB {
    foo: string;
    [key: string]: unknown;
}

export type MyObjectB = { [K in keyof BaseB]: any };
