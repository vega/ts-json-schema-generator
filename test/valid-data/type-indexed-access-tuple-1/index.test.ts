import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-indexed-access-tuple-1", assertValidSchema("type-indexed-access-tuple-1", "MyType"));
