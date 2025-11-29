import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("array-min-max-items-optional", assertValidSchema("array-min-max-items-optional", "MyType"));
