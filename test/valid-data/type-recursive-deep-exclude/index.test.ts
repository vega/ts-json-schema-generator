import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-recursive-deep-exclude", assertValidSchema("type-recursive-deep-exclude", "MyType"));
