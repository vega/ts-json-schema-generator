import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("class-multi", assertValidSchema("class-multi", "MyObject"));
