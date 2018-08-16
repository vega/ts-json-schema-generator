interface MySubObject {
    propA: number;
    propB: MySubObject;
}

export interface MyObject {
    sub: MySubObject;
}
