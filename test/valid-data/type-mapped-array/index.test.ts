import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-mapped-array", assertValidSchema("type-mapped-array", "MyObject"));
