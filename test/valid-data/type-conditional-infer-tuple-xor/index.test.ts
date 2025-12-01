import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-conditional-infer-tuple-xor", assertValidSchema("type-conditional-infer-tuple-xor", "MyType"));
