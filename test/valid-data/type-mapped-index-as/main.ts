interface SomeInterface {
    foo: 12;
    bar: "baz";
}

export type MyObject = {
    [K in keyof SomeInterface as Capitalize<K>]: `${K}.${SomeInterface[K]}`;
};
