type Capitalized<T extends string> = T extends Capitalize<string> ? true : false;
type Uncapitalized<T extends string> = T extends Uncapitalize<string> ? true : false;
type Uppercased<T extends string> = T extends Uppercase<string> ? true : false;
type Lowercased<T extends string> = T extends Lowercase<string> ? true : false;
type Union<T extends string> = T extends Capitalize<"foo" | "bar"> ? true : false;
type Infer<T extends string> = T extends Capitalize<infer U> ? U : false;

export type MyObject = {
    capitalized: Capitalized<"Foo">;
    notCapitalized: Capitalized<"foo">;
    uncapitalized: Uncapitalized<"foo">;
    notUncapitalized: Uncapitalized<"Foo">;
    uppercased: Uppercased<"FOO">;
    notUppercased: Uppercased<"Foo">;
    lowercased: Lowercased<"foo">;
    notLowercased: Lowercased<"FOO">;
    union: Union<"Foo">;
    infer: Infer<"Foo">;
    inferNonMatch: Infer<"foo">;
};
