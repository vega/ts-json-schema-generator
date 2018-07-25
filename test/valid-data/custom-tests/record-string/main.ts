export interface abc {
    a: number;
    b: number;
    c: number;
}


export type abc_string = Record<keyof abc, string>;

export interface MyObject {
    abc_string : abc_string
}
