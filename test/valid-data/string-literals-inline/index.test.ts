import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("string-literals-inline", assertValidSchema("string-literals-inline", "MyObject"));
