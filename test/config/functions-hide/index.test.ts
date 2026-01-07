import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - functions-hide",
    assertConfigSchema("functions-hide", {
        type: "MyType",
        functions: "hide",
    }),
);
