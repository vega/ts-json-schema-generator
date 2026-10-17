import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-indexed-access-tuple-rest",
    assertValidSchema("type-indexed-access-tuple-rest", "TupleElement"),
);
