export interface MyObject {
    a: number
}

export interface MyOtherObject {
    b: string
}

export type MyUnion = MyObject | MyOtherObject
