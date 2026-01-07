import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - import-anonymous", assertValidSchema("import-anonymous", "MyObject"));
