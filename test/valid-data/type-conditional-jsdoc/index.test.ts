import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-conditional-jsdoc", assertValidSchema("type-conditional-jsdoc", "MyObject"));
