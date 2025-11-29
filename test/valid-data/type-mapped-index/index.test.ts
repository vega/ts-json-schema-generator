import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-mapped-index", assertValidSchema("type-mapped-index", "MyObject"));
