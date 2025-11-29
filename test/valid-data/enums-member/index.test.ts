import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("enums-member", assertValidSchema("enums-member", "MyObject"));
