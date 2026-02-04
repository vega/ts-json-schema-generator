import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - expose-all-topref-true-not-exported",
    assertConfigSchema("expose-all-topref-true-not-exported", {
        type: "MyObject",
        expose: "all",
        topRef: true,
        jsDoc: "none",
    }),
);
