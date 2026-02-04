import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - mapped-intersection-index",
    assertConfigSchema("mapped-intersection-index", {
        type: "MyObject",
        additionalProperties: true,
    }),
);
