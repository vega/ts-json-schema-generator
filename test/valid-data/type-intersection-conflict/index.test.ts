import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-intersection-conflict", assertValidSchema("type-intersection-conflict", "MyObject"));
