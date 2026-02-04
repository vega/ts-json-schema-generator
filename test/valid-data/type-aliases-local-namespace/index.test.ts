import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-aliases-local-namespace", assertValidSchema("type-aliases-local-namespace", "MyObject"));
