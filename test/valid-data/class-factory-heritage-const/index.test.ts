import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - class-factory-heritage-const", assertValidSchema("class-factory-heritage-const", "ConstFactory"));
