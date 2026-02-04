import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - any-unknown", assertValidSchema("any-unknown", "MyObject"));
