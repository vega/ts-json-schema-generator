interface User {
    name: string;
    age: number;
}

type First = "a" | "b";
type Second = "b" | "c";

export interface MyObject {
    common: ("a" | "b" | "c") & ("b" | "c" | "d");
    narrowed: string & ("a" | "b");
    reverse: ("a" | "b") & string;
    numeric: number & (1 | 2);
    numericCommon: (1 | 2) & (2 | 3);
    boolean: boolean & true;
    mixed: (string | number) & ("a" | 1);
    aliased: First & Second;
    impossible?: ("a" | "b") & ("c" | "d");
    mismatched?: string & (1 | 2);
    prefixed: { [K in keyof User as `user_${K & string}`]: User[K] };
    unprefixed: { [K in keyof User as K & string]: User[K] };
    capitalized: { [K in keyof User as `get${Capitalize<K & string>}`]: User[K] };
}
