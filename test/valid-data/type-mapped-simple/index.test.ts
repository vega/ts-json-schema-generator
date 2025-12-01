import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-mapped-simple", assertValidSchema("type-mapped-simple", "MyObject"));
