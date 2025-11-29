import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-mapped-exclude", assertValidSchema("type-mapped-exclude", "MyObject"));
