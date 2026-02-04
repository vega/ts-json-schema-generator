import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - annotation-example", assertValidSchema("annotation-example", "MyObject"));
