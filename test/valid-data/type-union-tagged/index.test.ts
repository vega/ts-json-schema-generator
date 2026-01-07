import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-union-tagged", assertValidSchema("type-union-tagged", "Shape"));
