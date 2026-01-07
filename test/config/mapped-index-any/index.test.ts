import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - mapped-index-any",
    assertConfigSchema("mapped-index-any", {
        type: "*",
        additionalProperties: true,
    }),
);
