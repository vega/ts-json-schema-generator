type String<T extends string> = T extends `${string}` ? T : false;
type Number<T extends string> = T extends `${number}` ? T : false;
type Infer<T extends string> = T extends `${infer A}` ? A : false;
type MixedInfer<T extends string> = T extends `foo${infer A}bar` ? A : false;
type MixedNumber<T extends string> = T extends `foo${number}` ? T : false;
type Capitalized<T extends string> = T extends `${Capitalize<"foo">}` ? T : false;
type Union<T extends string> = T extends `foo${"123" | "456"}` ? T : false;

export type MyObject = {
    string: String<"foo">;
    number: Number<"123">;
    notNumber: Number<"foo">;
    infer: Infer<"foo">;
    mixedInfer: MixedInfer<"foo123bar">;
    mixedInferNonMatch: MixedInfer<"bar123foo">;
    mixedNumber: MixedNumber<"foo123">;
    mixedNumberNonMatch: MixedNumber<"bar123">;
    capitalized: Capitalized<"Foo">;
    union1: Union<"foo123">;
    union2: Union<"foo456">;
    unionNonMatch: Union<"bar123">;
};
