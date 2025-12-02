import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("import-exposed", assertValidSchema("import-exposed", "MyObject"));
