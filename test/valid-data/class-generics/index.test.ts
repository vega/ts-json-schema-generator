import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - class-generics", assertValidSchema("class-generics", "MyObject"));
