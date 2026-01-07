import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - generic-anonymous", assertValidSchema("generic-anonymous", "MyObject"));
