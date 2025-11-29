import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("interface-recursion", assertValidSchema("interface-recursion", "MyObject"));
