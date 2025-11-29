import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("interface-multi", assertValidSchema("interface-multi", "MyObject"));
