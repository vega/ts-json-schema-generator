export interface Test {
    numberField: number
}

export interface MyObject extends Partial<Test> {}
