type AorB = "A" | "B";

export type MyObject = Record<`letter-${AorB}`, string>;
