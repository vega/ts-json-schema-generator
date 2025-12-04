import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - jsdoc-complex-extended",
    assertConfigSchema("jsdoc-complex-extended", {
        type: "MyObject",
        expose: "export",
        topRef: true,
        jsDoc: "extended",
    }),
);

// ensure that skipping type checking doesn't alter the JSON schema output
it(
    "config - jsdoc-complex-extended (skipTypeCheck)",
    assertConfigSchema("jsdoc-complex-extended", {
        type: "MyObject",
        expose: "export",
        topRef: true,
        jsDoc: "extended",
        skipTypeCheck: true,
    }),
);
