import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("generic-default", assertValidSchema("generic-default", "MyObject"));
