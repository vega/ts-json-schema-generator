const BASE = ["foo", "bar"] as const;

export const ALL = [...BASE, "baz"] as const;
export type MyType = typeof ALL;
