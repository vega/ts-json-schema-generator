import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-indexed-access-object-1", assertValidSchema("type-indexed-access-object-1", "MyType"));
