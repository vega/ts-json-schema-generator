import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-conditional-infer", assertValidSchema("type-conditional-infer", "MyType"));
