import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-conditional-jsdoc", assertValidSchema("type-conditional-jsdoc", "MyObject"));
