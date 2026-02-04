import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - type-tuple-nested-rest-uniform", assertValidSchema("type-tuple-nested-rest-uniform", "MyType"));
