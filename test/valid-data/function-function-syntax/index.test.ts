import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - function-function-syntax", assertValidSchema("function-function-syntax", "myFunction"));
