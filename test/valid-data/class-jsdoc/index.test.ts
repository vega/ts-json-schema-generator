import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("class-jsdoc", assertValidSchema("class-jsdoc", "MyObject"));
