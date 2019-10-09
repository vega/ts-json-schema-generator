export interface BaseObject {
    /**
     * Foo
     */
    foo: number | string;
    /**
     * Bar
     */
    bar?: number | string;
}

type ExcludeString<T> = {
    [P in keyof T]: Exclude<T[P], string>;
};

export type CleanedUp = ExcludeString<BaseObject>;

export type MyObject = {
    [P in keyof CleanedUp]: CleanedUp[P] | null;
};
