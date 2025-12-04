import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - annotation-id", assertValidSchema("annotation-id", "MyObject", { schemaId: "Test" }));
