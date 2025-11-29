import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("array-min-items-1", assertValidSchema("array-min-items-1", "MyType"));
