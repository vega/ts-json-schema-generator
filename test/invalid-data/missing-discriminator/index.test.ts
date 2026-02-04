import { it } from "node:test";
import { assertInvalidSchema } from "../../utils";

it(
    "invalid-data - missing-discriminator",
    assertInvalidSchema("missing-discriminator", "MyType", 'Cannot find discriminator keyword "type" in type B.'),
);
