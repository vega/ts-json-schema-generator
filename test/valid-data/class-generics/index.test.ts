import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("class-generics", assertValidSchema("class-generics", "MyObject"));
