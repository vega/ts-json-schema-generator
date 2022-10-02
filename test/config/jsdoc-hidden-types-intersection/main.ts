/**
 * @hidden
 */
export interface Hidden {
    hidden?: number;
}

export type Hidden2 = Hidden;

export interface Visible {
    visible: string;
}

export interface Intersection extends Visible, Hidden {}

export type MyType = {
    /**
     * @hidden
     */
    hidden: Visible;
    hidden2?: Hidden;
    visible: Visible;
    intersection: Intersection;
};
