export const a = {
    a: "A",
} as const;

export const b = {
    ...a,
    b: "B",
} as const;

export type A = typeof a;
export type B = typeof b;

export type MyType = [A, B];
