type SomeKeys = "a" | "b" | "c";

export type MyObject = {
    [K in SomeKeys]?: K;
};
