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
}
