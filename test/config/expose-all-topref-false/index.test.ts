import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - expose-all-topref-false",
    assertConfigSchema("expose-all-topref-false", {
        type: "MyObject",
        expose: "all",
        topRef: false,
        jsDoc: "none",
    }),
);
