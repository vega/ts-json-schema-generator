export type MyObject = Partial<Readonly<Pick<Record<"a" | "b" | "c", string | null>, "b" | "c">>>;
