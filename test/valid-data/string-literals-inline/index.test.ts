import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - string-literals-inline", assertValidSchema("string-literals-inline", "MyObject"));
