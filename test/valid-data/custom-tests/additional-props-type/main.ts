export type sometype = any;

export interface paramAny extends StringMap<sometype> {
    param : string
}

export interface StringMap<T> {
    [key : string] : T
}