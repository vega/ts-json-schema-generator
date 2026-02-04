import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - import-simple", assertValidSchema("import-simple", "MyObject"));
