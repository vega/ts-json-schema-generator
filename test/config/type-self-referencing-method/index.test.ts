import { it } from "node:test";
import { assertConfigSchema } from "../../utils";

it(
    "config - type-self-referencing-method",
    assertConfigSchema("type-self-referencing-method", { type: "MyType" }, true),
);
