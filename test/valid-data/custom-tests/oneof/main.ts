
export interface IStuff {
    a: string;
    b: number;
    c: string;
}


export interface IOneOfStuff<T> {
    OneOfStuff: OneOf<T>;
}

export declare type OneOf<T> = {
    [K in keyof T]: Pick<T, K>;
}[keyof T];


export interface MyObject extends Partial<IOneOfStuff<IStuff>> {}