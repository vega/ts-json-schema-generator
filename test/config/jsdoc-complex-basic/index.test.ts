import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - jsdoc-complex-basic",
    assertConfigSchema("jsdoc-complex-basic", {
        type: "MyObject",
        expose: "export",
        topRef: true,
        jsDoc: "basic",
    }),
);
