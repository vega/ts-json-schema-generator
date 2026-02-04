import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - import-exposed", assertValidSchema("import-exposed", "MyObject"));
