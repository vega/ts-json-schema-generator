import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - import-internal", assertValidSchema("import-internal", "MyObject", { jsDoc: "basic" }));
