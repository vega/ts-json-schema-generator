import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - annotation-default",
    assertValidSchema("annotation-default", "MyObject", undefined, {
        validSamples: [
            {
                nullField: null,
                numberField: 100,
                stringField: "goodbye",
                arrayField: [],
                booleanField: false,
                nestedField: {},
            },
        ],
        invalidSamples: [{ nullField: null, numberField: 10, stringField: "hello" }, {}],
    }),
);

test(
    "valid-data - annotation-default",
    assertValidSchema("annotation-default", "MyObject", undefined, {
        validSamples: [{ nullField: null, numberField: 10, stringField: "hello" }, {}],
        ajvOptions: { useDefaults: true },
    }),
);
