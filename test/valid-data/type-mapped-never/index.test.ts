import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-mapped-never", assertValidSchema("type-mapped-never", "MyObject"));
