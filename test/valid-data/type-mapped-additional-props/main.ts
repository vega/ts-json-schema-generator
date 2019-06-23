export interface Test {
    [ name: string ]: string;
}

export type WithNumbers<T> = {
    [P in keyof T]: T[P] | number;
};
export type MyObject = WithNumbers<Test>;
