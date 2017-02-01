export interface Square {
    kind: "square";
    size: number;
}

export interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}

export interface Circle {
    kind: "circle";
    radius: number;
}

export type Shape = Square | Rectangle | Circle;
