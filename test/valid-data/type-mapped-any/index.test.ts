import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-any", assertValidSchema("type-mapped-any", "MyObject"));
