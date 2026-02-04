import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - function-parameters-optional", assertValidSchema("function-parameters-optional", "myFunction"));
