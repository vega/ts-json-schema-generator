const foo = {
    foo: 60 * 5,
} as const satisfies { foo: number };

export type MyObject = typeof foo;
