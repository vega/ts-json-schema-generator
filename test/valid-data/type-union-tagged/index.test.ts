import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("type-union-tagged", assertValidSchema("type-union-tagged", "Shape"));
