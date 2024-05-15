export interface MyObject extends StringMap {
    param: string;
}

export interface StringMap {
    [key: string]: any;
}
