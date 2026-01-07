import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-conditional-infer-rest", assertValidSchema("type-conditional-infer-rest", "MyType"));
