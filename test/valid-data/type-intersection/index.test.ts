import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-intersection", assertValidSchema("type-intersection", "MyObject"));
