import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-maps", assertValidSchema("type-maps", "MyObject"));
