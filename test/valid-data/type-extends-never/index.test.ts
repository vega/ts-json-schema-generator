import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-extends-never", assertValidSchema("type-extends-never", "MyType"));
