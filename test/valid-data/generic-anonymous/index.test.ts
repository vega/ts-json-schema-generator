import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("generic-anonymous", assertValidSchema("generic-anonymous", "MyObject"));
