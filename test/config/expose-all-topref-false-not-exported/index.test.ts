import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - expose-all-topref-false-not-exported",
    assertConfigSchema("expose-all-topref-false-not-exported", {
        type: "MyObject",
        expose: "all",
        topRef: false,
        jsDoc: "none",
    }),
);
