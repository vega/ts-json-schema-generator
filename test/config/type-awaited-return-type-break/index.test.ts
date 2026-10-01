import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - type-awaited-return-type-break",
    assertConfigSchema(
        "type-awaited-return-type-break",
        {
            type: "MyType",
        },
        true,
    ),
);
