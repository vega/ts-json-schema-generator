import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("string-literals-intrinsic", assertValidSchema("string-literals-intrinsic", "MyObject"));
