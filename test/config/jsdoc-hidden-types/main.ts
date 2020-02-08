/**
 * @hidden
 */
export type Hidden = number;

export type Hidden2 = Hidden;

export type Visible = number;

export type MyType = {
    /**
     * @hidden
     */
    hidden: Visible;
    hidden2?: Hidden;
    visible: Visible | Hidden2;
};
