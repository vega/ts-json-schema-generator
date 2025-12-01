import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-intersection-with-arrays", assertValidSchema("type-intersection-with-arrays", "*"));
