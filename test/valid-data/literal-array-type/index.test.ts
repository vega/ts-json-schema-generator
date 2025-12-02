import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("literal-array-type", assertValidSchema("literal-array-type", "MyType"));
