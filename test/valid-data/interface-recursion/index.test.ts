import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - interface-recursion", assertValidSchema("interface-recursion", "MyObject"));
