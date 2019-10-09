type Test = {
    /**
     * Foo
     */
    foo?: string | number;
    /**
     * Bar
     */
    bar: string | number;
};

type WithoutNumbers<T> = {
    [P in keyof T]: Exclude<T[P], number>;
};

export type MyObject = WithoutNumbers<Test>;
