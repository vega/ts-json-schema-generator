import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - string-literals-intrinsic", assertValidSchema("string-literals-intrinsic", "MyObject"));
