type InferObject<T extends { a: any }> = T extends { a: infer A } ? A : never;

export type MyType = InferObject<{ a: string }>;
