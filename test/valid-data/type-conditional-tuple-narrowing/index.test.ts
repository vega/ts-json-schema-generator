import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-conditional-tuple-narrowing", assertValidSchema("type-conditional-tuple-narrowing", "MyObject"));
