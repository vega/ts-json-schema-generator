const record = { x: "hello", y: "goodbye" } satisfies Record<string, string>;
export type MyType = keyof typeof record;
