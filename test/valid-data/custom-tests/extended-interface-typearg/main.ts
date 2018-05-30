
export interface IStuff {
    a: string;
    b: number;
    c: string;
}


export interface IListsable {
    lists: Array<IStuff>;
}

export interface IRequestParams<T> {
    /**
     * @ignore
     */
    readonly responseType?: T;
}

export interface IRes extends IListsable {}

export interface MyObject extends Partial<IRequestParams<IRes>> {}