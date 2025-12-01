import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-keyof-object", assertValidSchema("type-keyof-object", "MyType"));
