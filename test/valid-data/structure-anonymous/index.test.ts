import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - structure-anonymous", assertValidSchema("structure-anonymous", "MyObject"));
