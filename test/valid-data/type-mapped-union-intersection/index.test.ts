import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-union-intersection", assertValidSchema("type-mapped-union-intersection", "MyObject"));
