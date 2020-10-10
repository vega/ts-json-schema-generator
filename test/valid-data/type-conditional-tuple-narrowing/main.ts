type SecondElementType<T extends any[]> = T extends { length: 3 } ?
    T[1] :
    unknown;

export type MyObject = {
    string: SecondElementType<[number, string, boolean]>;
    booleanOrNumber: SecondElementType<[string, boolean, string] | [number, number, boolean] >;
    unknown?: SecondElementType<number[]>;
}
