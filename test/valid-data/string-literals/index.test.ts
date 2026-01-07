import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - string-literals", assertValidSchema("string-literals", "MyObject"));
