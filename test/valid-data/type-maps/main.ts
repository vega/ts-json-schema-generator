export interface MyType {}

export interface MyMap1 {
    [id: string]: MyType;
}

export interface MyMap2 {
    [id: string]: (string | number);
}

export interface MyObject {
    map1: MyMap1;
    map2: MyMap2;
    map3: object;
}
