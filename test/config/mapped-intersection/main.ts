interface Base {
    foo: string;
    bar: null;
}

type Keep<B, K extends keyof B> = { [P in Exclude<keyof B, K>]: B[P] };

export type MyObject = Keep<Base, "bar"> & { bar: number };
