import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - exported-enums-union", assertValidSchema("exported-enums-union", "MyObject"));
