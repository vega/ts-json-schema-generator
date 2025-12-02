import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("annotation-comment", assertValidSchema("annotation-comment", "MyObject"));
