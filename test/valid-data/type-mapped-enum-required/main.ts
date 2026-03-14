enum Key {
    A = "a",
    B = "b",
}

type WithOptionalEnumKeys = {
    [P in Key]?: string;
};

export type MyObject = Required<WithOptionalEnumKeys>;
