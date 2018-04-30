
export interface ISysListDb {
    a: string;
    b: number;
    c: string;
}


export interface IFilterable<T> {
    filters: OneOf<T>; //oneof has not been tested yet.
}

export declare type OneOf<T> = {
    [K in keyof T]: Pick<T, K>;
}[keyof T];


export interface MyObject extends Partial<IFilterable<ISysListDb>> {}