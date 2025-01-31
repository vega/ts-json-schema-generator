enum Variant {
    A = 0,
    B = "STR",
}

type KVMap = {
    [Variant.A]: boolean;
    [Variant.B]: number;
};

export type Value = KVMap[Variant];
