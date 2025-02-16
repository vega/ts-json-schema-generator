type Variant = 0 | "ONE";

type KVMap = {
    0: boolean;
    ONE: number;
};

export type Value = KVMap[Variant];
