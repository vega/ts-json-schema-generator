import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - class-recursion", assertValidSchema("class-recursion", "MyObject"));
