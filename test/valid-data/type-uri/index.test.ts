import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-uri", assertValidSchema("type-uri", "MyObject"));
