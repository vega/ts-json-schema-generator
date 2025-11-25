const foo = {
    foo: 60 * 5,
} as const;

export type MyObject = typeof foo;
