import { it } from "node:test";
import { assertInvalidSchema } from "../../utils";

it(
    "invalid-data - non-union-discriminator",
    assertInvalidSchema(
        "non-union-discriminator",
        "MyType",
        "Cannot assign discriminator tag to type: interface-2103469249-0-76-2103469249-0-77. This tag can only be assigned to union types.",
    ),
);
