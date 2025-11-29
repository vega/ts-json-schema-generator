import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("structure-recursion", assertValidSchema("structure-recursion", "MyObject"));
