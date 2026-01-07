import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-template-literal", assertValidSchema("type-mapped-template-literal", "MyObject"));
