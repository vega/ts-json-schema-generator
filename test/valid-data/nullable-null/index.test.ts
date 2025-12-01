import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - nullable-null", assertValidSchema("nullable-null", "MyObject"));
