import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - tsconfig-support",
    assertConfigSchema(
        "tsconfig-support",
        {
            type: "MyObject",
            expose: "all",
            topRef: false,
            jsDoc: "none",
        },
        true,
    ),
);
