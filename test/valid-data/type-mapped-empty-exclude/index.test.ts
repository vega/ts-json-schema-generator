import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-mapped-empty-exclude", assertValidSchema("type-mapped-empty-exclude", "MyObject"));
