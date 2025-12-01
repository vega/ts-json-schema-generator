import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("array-min-items-2", assertValidSchema("array-min-items-2", "MyType"));
