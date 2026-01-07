import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-aliases-anonymous", assertValidSchema("type-aliases-anonymous", "MyObject"));
