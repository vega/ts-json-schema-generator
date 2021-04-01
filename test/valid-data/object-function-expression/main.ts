const bar = () => ({ bar: 1 });

export const Foo = {
    x: bar(),
};

export type MyType = keyof typeof Foo;
