import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - interface-single", assertValidSchema("interface-single", "MyObject"));
