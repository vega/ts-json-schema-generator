type TypeName<T> = T extends string ? "string" : T extends number ? "number" : "unknown";

export type MyObject = {
    a: TypeName<string>;
    b: TypeName<number>;
    c: TypeName<boolean>;
};
