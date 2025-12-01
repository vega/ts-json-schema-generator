import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("class-single", assertValidSchema("class-single", "MyObject"));
