import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-typeof-zod-infer", assertValidSchema("type-typeof-zod-infer", "MyObject"));
