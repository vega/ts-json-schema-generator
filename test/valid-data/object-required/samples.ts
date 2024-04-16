import type { MyObject } from "./main.js";

export const validSamples: MyObject[] = [
    {
        id: "123",
        keys: ["a", "b"],
        definitions: { a: 1, b: 2 },
    },
    {
        id: "123",
        keys: [],
        definitions: {},
    },
];

export const invalidSamples: MyObject[] = [
    {
        keys: ["a", "b"],
        definitions: { a: 1, b: 2 },
    },
    {
        id: "123",
        keys: ["a", "b"],
        definitions: { a: 1 },
    },
];
