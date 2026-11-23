import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - annotation-custom-keyword",
    assertValidSchema(
        "annotation-custom-keyword",
        "MyObject",
        { jsDoc: "basic", extraTags: ["oneOf"] },
        {
            validSamples: [{ x: 1 }, { y: 2 }, { z: 3 }],
            invalidSamples: [{}, { x: 1, y: 2 }, { x: 1, y: 2, z: 3 }],
        },
    ),
);
