import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-keyof-object-function", assertValidSchema("type-keyof-object-function", "MyType"));
