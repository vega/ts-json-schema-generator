import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-mapped-enum-optional", assertValidSchema("type-mapped-enum-optional", "MyObject"));
