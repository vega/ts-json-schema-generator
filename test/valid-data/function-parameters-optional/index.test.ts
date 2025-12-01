import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("function-parameters-optional", assertValidSchema("function-parameters-optional", "myFunction"));
