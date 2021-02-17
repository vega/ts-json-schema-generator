export interface Main<ID extends string> {
    id: ID;
    a: string;
    b?: string;
}

type MyId = "MyId";
export interface Generic<ID extends string, W extends keyof Main<ID> = never, B extends keyof Main<ID> = any> {
    whitelist: Pick<Main<MyId>, W>;
    blacklist: Pick<Main<MyId>, B>;
}

export interface MyObject extends Generic<MyId> {}
