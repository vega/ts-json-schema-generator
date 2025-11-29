import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("string-literals", assertValidSchema("string-literals", "MyObject"));
