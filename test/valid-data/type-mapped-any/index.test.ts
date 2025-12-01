import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-mapped-any", assertValidSchema("type-mapped-any", "MyObject"));
