export interface Test {
    numberField: number,
    stringField: string
}

export interface MyObject extends Partial<Test> {}
