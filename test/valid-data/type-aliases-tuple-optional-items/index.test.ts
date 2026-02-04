import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-aliases-tuple-optional-items",
    assertValidSchema("type-aliases-tuple-optional-items", "MyTuple"),
);
