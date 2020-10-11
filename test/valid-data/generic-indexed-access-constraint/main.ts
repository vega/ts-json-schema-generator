export interface MyGeneric<T extends { a?: string; b: number }> {
    a?: T["a"];
    b: T["b"];
}

export interface MyObject extends MyGeneric<{ b: number }> {}
