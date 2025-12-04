import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - simple-object", assertValidSchema("simple-object", "SimpleObject"));
