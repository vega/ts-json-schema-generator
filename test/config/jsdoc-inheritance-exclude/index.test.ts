import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - jsdoc-inheritance-exclude",
    assertConfigSchema("jsdoc-inheritance-exclude", {
        type: "MyType",
        expose: "export",
        topRef: true,
        jsDoc: "extended",
    }),
);
