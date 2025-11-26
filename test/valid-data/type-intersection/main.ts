export interface Type1 {
    value1: string;
}
export interface Type2 {
    value2: number;
}

export interface Type3 {
    value3: number;
}

export interface MyObject {
    value: Type1 &
        Type2 & {
            foo: Type3;
        };
}
