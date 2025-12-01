import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-aliases-local-namespace", assertValidSchema("type-aliases-local-namespace", "MyObject"));
