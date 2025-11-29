import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-typeof-enum", assertValidSchema("type-typeof-enum", "MyObject"));
