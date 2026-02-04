import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - string-template-literals", assertValidSchema("string-template-literals", "MyObject"));
