import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-indexed-access-type-union", assertValidSchema("type-indexed-access-type-union", "MyType"));
