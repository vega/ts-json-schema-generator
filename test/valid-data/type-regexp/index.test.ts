import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-regexp", assertValidSchema("type-regexp", "MyObject"));
