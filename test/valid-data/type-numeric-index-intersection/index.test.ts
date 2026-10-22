import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-numeric-index-intersection", assertValidSchema("type-numeric-index-intersection", "MyObject"));
