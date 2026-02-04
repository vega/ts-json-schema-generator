import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - enums-member", assertValidSchema("enums-member", "MyObject"));
