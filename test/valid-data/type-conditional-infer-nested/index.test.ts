import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-conditional-infer-nested", assertValidSchema("type-conditional-infer-nested", "MyType"));
