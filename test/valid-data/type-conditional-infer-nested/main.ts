type Nested<T extends Array<Array<any>>> = T extends Array<infer A> ? (A extends Array<infer B> ? B : never) : never;

export type MyType = Nested<[[string, number], [boolean]]>;
