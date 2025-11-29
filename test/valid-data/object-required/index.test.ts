import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "object-required",
    assertValidSchema("object-required", "MyObject", undefined, {
        invalidSamples: [
            { keys: ["a", "b"], definitions: { a: 1, b: 2 } },
            { id: "123", keys: ["a", "b"], definitions: { a: 1 } },
        ],
        validSamples: [
            { id: "123", keys: ["a", "b"], definitions: { a: 1, b: 2 } },
            { id: "123", keys: [], definitions: {} },
        ],
        ajvOptions: { $data: true },
    }),
);
