import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - class-inheritance", assertValidSchema("class-inheritance", "MyObject"));
