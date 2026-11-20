import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - class-jsdoc-default", assertValidSchema("class-jsdoc-default", "MyObject"));
