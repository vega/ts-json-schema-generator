import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - annotation-comment", assertValidSchema("annotation-comment", "MyObject"));
