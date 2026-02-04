import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-satisfies", assertValidSchema("type-satisfies", "MyType"));
