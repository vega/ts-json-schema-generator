import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - mapped-intersection-complex",
    assertConfigSchema("mapped-intersection-complex", {
        type: "MyObject",
        additionalProperties: true,
    }),
);
