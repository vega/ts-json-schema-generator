const RuntimeObject = {
    FOO: "foo-val",
    BAR: "bar-val",
} as const;

type ValueOf<T> = T[keyof T];

export type MyType = ValueOf<typeof RuntimeObject>;
