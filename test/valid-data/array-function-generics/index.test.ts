import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - array-function-generics", assertValidSchema("array-function-generics", "*"));
