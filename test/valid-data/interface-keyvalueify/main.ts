
export interface MyInterface {
    numberField: number
}

export interface KeyValueify<T> {
    key :   keyof T
    value : T[keyof T]
}

export interface MyObject extends KeyValueify<MyInterface> {}
