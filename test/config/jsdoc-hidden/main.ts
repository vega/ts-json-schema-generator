// You can hide enum entries and object properties by annotating them with @hidden.

export enum Enum {
    /**
     * Hidden. Comments for enum values are ignored.
     *
     * @hidden
     */
    X = "x",
    Y = "y",
}

/**
 * @hidden
 */
export type Hidden = "hidden";

export type Options = Hidden | "up" | "down";

export interface MyObject {
    /**
     * This property should appear.
     */
    foo: number;

    /**
     * This property should not appear.
     *
     * @hidden
     */
    hidden: number;

    bar: Enum;

    options: Options;
}
