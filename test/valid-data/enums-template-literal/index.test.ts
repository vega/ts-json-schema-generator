import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("enums-template-literal", assertValidSchema("enums-template-literal", "MyObject"));
