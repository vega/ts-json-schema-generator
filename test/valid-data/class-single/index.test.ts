import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - class-single", assertValidSchema("class-single", "MyObject"));
