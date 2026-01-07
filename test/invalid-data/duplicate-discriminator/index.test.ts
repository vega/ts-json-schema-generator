import { it } from "node:test";
import { assertInvalidSchema } from "../../utils";

it(
    "invalid-data - duplicate-discriminator",
    assertInvalidSchema("duplicate-discriminator", "MyType", 'Duplicate discriminator values: A in type "(A|B)".'),
);
