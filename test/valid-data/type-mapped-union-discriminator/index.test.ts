import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "valid-data - type-mapped-union-discriminator",
    assertValidSchema("type-mapped-union-discriminator", "MyObject", { jsDoc: "basic", discriminatorType: "open-api" }),
);
