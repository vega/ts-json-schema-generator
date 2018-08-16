export interface paramAny extends StringMap<any> {
    param : string
}

export interface StringMap<T> {
    [key : string] : T
}