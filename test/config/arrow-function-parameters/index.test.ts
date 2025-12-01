import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - arrow-function-parameters",
    assertConfigSchema("arrow-function-parameters", {
        type: "myFunction",
        expose: "all",
    }),
);
