
export interface MyInterface {
    numberField: number,
    stringField: string
    string2Field: {}
}

export interface MyObject extends Pick<MyInterface, "stringField"> {}
