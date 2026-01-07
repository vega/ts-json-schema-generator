import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - enums-union", assertValidSchema("enums-union", "MyObject"));
