export interface Box<T> {
    value: T;
    wrap: () => Box<T[]>;
}

export interface MyObject {
    box: Box<string>;
    item: Box<number>["value"];
}

function makeBox(value: string): Box<string> {
    return { value, wrap: () => makeBox(value) as unknown as Box<string[]> };
}

export type MyReturnType = ReturnType<typeof makeBox>["value"];
