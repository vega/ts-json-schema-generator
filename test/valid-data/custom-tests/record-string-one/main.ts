export interface abc {
    a: number
}


export type abc_string = Record<keyof abc, string>;

export interface MyObject {
    abc_string : abc_string
}
