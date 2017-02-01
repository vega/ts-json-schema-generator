export interface Type1 {
    value1: string;
}
export interface Type2 {
    value2: number;
}

export interface MyObject {
    value: Type1 & Type2;
}
