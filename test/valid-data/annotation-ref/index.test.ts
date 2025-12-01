import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("annotation-ref", assertValidSchema("annotation-ref", "MyObject"));
