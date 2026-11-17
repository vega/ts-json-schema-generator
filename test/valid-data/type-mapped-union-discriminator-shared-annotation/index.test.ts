import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-mapped-union-discriminator-shared-annotation",
    assertValidSchema("type-mapped-union-discriminator-shared-annotation", "*", { jsDoc: "basic", discriminatorType: "open-api" }),
);
