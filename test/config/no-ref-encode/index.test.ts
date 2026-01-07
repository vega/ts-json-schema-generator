import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - no-ref-encode",
    assertConfigSchema("no-ref-encode", {
        type: "MyObject",
        expose: "all",
        encodeRefs: false,
        topRef: true,
        jsDoc: "none",
    }),
);
