import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - binary-expression", assertValidSchema("binary-expression", "MyObject"));
