import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - structure-private", assertValidSchema("structure-private", "MyObject"));
