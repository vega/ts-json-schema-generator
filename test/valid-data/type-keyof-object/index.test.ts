import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-keyof-object", assertValidSchema("type-keyof-object", "MyType"));
