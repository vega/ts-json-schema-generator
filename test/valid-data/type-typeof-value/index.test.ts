import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-typeof-value", assertValidSchema("type-typeof-value", "MyType"));
