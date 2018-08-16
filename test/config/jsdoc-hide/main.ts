// You can hide enum entries and object proeprties by annotating them with @hide.

export enum Enum {
    /**
     * Hidden. Comments for enum values are ignored.
     *
     * @hide
     */
    X = "x",
    Y = "y",
}

/**
 * @hide
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
     * @hide
     */
    hidden: number;

    bar: Enum;

    options: Options;
}
