type KindA = "kind_a";
type KindB = "kind_b";

interface ObjectA {
    kind: KindA;
    value: number;
}

interface ObjectB {
    kind: KindB;
    name: string;
}

export type MyUnion = ObjectA | ObjectB;
