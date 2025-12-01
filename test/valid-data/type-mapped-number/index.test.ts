import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-mapped-number", assertValidSchema("type-mapped-number", "*"));
