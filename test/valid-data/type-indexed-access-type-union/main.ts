export type Foo = { foo: number } | { foo: boolean };

export type MyType = Partial<Foo>;
