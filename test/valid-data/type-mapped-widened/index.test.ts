import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-widened", assertValidSchema("type-mapped-widened", "MyObject"));
