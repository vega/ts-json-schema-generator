type A = { kind: "a" | "A", a: string };
type B = { kind: "b" | "B", b: string };

/**
 * @discriminator kind
 */
export type AB = A | B;
