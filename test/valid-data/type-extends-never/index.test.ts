import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-extends-never", assertValidSchema("type-extends-never", "MyType"));
