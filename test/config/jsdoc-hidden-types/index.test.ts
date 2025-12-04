import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - jsdoc-hidden-types",
    assertConfigSchema("jsdoc-hidden-types", {
        type: "MyType",
        expose: "export",
        topRef: true,
        jsDoc: "extended",
    }),
);
