import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - function-parameters-all",
    assertConfigSchema("function-parameters-all", {
        type: "*",
    }),
);
