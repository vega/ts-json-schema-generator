import { assertValidSchema } from "../../utils";
import { test } from "node:test";

test("valid-data - interface-extra-props", assertValidSchema("interface-extra-props", "MyObject"));
