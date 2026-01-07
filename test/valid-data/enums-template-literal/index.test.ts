import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - enums-template-literal", assertValidSchema("enums-template-literal", "MyObject"));
