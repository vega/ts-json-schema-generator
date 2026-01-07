import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - class-jsdoc", assertValidSchema("class-jsdoc", "MyObject"));
