import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-aliases-union", assertValidSchema("type-aliases-union", "MyUnion"));
