import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-aliases-tuple-rest-additional-only",
    assertValidSchema("type-aliases-tuple-rest-additional-only", "MyTuple"),
);
