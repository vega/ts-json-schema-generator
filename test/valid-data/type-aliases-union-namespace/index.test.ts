import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-aliases-union-namespace", assertValidSchema("type-aliases-union-namespace", "MyModel"));
