import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - import-dynamic", assertValidSchema("import-dynamic", "MyObject"));
