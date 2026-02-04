import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-typeof-function", assertValidSchema("type-typeof-function", "*"));
