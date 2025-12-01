import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - class-new-expression", assertValidSchema("class-new-expression", "MyType"));
