import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-aliases-mixed", assertValidSchema("type-aliases-mixed", "MyObject"));
