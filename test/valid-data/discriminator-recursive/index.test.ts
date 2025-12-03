import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test(
    "discriminator-recursive",
    assertValidSchema("discriminator-recursive", "*", { jsDoc: "basic", discriminatorType: "open-api" }),
);
