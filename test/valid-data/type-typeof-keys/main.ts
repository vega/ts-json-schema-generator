const IDX = {
    foo: 1,
    bar: 1,
};

export const keys = Object.keys as <T>(o: T) => Extract<keyof T, string>[];
export const Foo = keys(IDX);

export type MyType = typeof Foo[number];
