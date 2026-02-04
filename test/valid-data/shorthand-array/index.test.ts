import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - shorthand-array", assertValidSchema("shorthand-array", "MyType"));
