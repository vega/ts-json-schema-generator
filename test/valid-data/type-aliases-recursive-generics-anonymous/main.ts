type Map<T> = { [key: string]: T };

export type MyAlias = {
    a: Map<MyAlias>;
};
