type GetRest<T extends any[]> = T extends [any, ...infer T] ? T : never;

export type MyType = GetRest<[string, string, number, boolean]>;
