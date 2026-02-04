import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - function-parameters-required", assertValidSchema("function-parameters-required", "myFunction"));
