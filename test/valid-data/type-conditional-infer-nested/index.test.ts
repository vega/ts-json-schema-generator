import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-conditional-infer-nested", assertValidSchema("type-conditional-infer-nested", "MyType"));
