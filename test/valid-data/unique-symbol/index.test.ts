import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("unique-symbol", assertValidSchema("unique-symbol", "MyObject"));
