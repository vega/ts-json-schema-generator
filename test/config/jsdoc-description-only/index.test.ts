import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - jsdoc-description-only",
    assertConfigSchema("jsdoc-description-only", {
        type: "MyObject",
        expose: "export",
        topRef: true,
        jsDoc: "extended",
    }),
);
