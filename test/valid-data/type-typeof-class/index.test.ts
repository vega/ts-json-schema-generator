import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-typeof-class", assertValidSchema("type-typeof-class", "MyObject"));
