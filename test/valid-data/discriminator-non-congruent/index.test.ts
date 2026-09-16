import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - discriminator-non-congruent",
    assertValidSchema("discriminator-non-congruent", "Declaration", undefined, {
        validSamples: [
            { kind: "function", name: "myFunc" },
            { kind: "variable", name: "myVar" },
            { name: "simple" },
            { name: "another", value: 123 },
        ],
        invalidSamples: [
            { kind: "function" }, // missing name
            { kind: "unknown", name: "bad" }, // unknown kind
            { value: 123 }, // missing name (matches AnotherDeclaration shape but missing name)
            { kind: "function", name: 123 }, // wrong type
        ],
    }),
);
