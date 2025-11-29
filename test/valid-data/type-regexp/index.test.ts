import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-regexp", assertValidSchema("type-regexp", "MyObject"));
