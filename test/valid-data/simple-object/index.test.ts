import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("simple-object", assertValidSchema("simple-object", "SimpleObject"));
