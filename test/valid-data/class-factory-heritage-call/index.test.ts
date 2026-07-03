import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - class-factory-heritage-call", assertValidSchema("class-factory-heritage-call", "DirectFactory"));
