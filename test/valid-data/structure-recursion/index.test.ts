import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - structure-recursion", assertValidSchema("structure-recursion", "MyObject"));
