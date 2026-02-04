import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-literal", assertValidSchema("type-mapped-literal", "MyObject"));
