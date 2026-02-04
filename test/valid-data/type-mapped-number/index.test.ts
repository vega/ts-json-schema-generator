import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-mapped-number", assertValidSchema("type-mapped-number", "*"));
