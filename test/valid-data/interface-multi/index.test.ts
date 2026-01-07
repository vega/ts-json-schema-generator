import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - interface-multi", assertValidSchema("interface-multi", "MyObject"));
