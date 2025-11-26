export interface MyArrayObjectType {
    a: string;
    b: number;
    c: string;
}

export interface IListsable {
    lists: Array<MyArrayObjectType>;
}

export interface IRequestParams<T> {
    readonly responseType?: T;
}

export interface IRes {
    foo: IListsable;
}

export interface MyObject extends Partial<IRequestParams<IRes>> {}
