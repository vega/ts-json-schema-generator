type A = {
    a: string;
};

type B = {
    b: number;
};

type MappedUnion<T extends object> = {
    [P in keyof T]: number;
};

export type MyObject = MappedUnion<A | B>;
