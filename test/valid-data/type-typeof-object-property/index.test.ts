import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-typeof-object-property", assertValidSchema("type-typeof-object-property", "MyType"));
