import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-immutable-array", assertValidSchema("type-immutable-array", "MyType"));
