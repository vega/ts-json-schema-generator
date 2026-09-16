import { test } from "node:test";
import { assertValidSchema } from "../../utils";

test("valid-data - schema-id-ref-prefix", assertValidSchema("schema-id-ref-prefix", "*", { schemaId: "api" }));
