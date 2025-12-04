import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("generic-indexed-access-constraint", assertValidSchema("generic-indexed-access-constraint", "MyObject"));
