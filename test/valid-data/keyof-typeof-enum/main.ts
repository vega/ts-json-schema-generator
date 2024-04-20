import { Size } from "./Size";

enum Orientation {
    Horizontal,
    Vertical,
}

export type MyObject = {
    sizeName?: keyof typeof Size;
    orientationName?: keyof typeof Orientation;
};
