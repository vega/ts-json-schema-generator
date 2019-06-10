type Test = string[];

type WithNumbers<T> = {
    [P in keyof T]: T[P] | number;
};

export type MyObject = WithNumbers<Test>;
