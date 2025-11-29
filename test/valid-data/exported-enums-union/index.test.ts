import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("exported-enums-union", assertValidSchema("exported-enums-union", "MyObject"));
