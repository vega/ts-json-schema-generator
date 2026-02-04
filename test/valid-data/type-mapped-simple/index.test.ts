import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-simple", assertValidSchema("type-mapped-simple", "MyObject"));
